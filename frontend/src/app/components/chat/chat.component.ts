import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Message, NewMessage } from '../../interfaces/message/index';
import { MessageService } from '../../services/message.service';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NewQuestionThread, QuestionThread, VisibilityType } from '../../interfaces/questionThread';
import { QuestionThreadService } from '../../services/questionThread.service';
import { interval, Observable, of, Subscription, switchMap } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.less'],
    standalone: true,
    imports: [
        MatIcon,
        MatCard,
        CommonModule,
        FormsModule,
        MatToolbarModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatMenuTrigger,
        MatTooltipModule,
    ]
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy {
    @Input() questionThreadId!: string;
    @Input() showHeader: boolean = true;
    @Input() assignmentId: string = "";
    @Input() learningObjectId: string = "";
    @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

    public messages: Message[] = [];
    public newMessageContent = '';
    public currentUserId: string = '';
    public usernamesMap: { [id: string]: string } = {};
    public currentThread: QuestionThread = {} as QuestionThread;
    public showVisibilityMenu = false;
    public VisibilityType = VisibilityType; // For template binding

    private pollingSubscription!: Subscription;

    constructor(
        private messageService: MessageService,
        private threadService: QuestionThreadService,
        private authService: AuthenticationService,
        private userService: UserService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.currentUserId = this.authService.retrieveUserId() || '';
        if (!this.currentUserId) {
            console.error('ChatComponent: Could not retrieve user ID');
        }
        console.log("ChatComponent ngOnInit - initial questionThreadId:", this.questionThreadId, "assignmentId:", this.assignmentId, "learningObjectId:", this.learningObjectId);

        this.prepareInitialData();

        if (this.questionThreadId && this.questionThreadId !== "new") {
            this.startPolling();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log("ChatComponent ngOnChanges:", changes);
        if (changes['questionThreadId'] || changes['assignmentId'] || changes['learningObjectId']) {
            console.log("ChatComponent ngOnChanges - new questionThreadId:", this.questionThreadId, "assignmentId:", this.assignmentId, "learningObjectId:", this.learningObjectId);
            this.prepareInitialData();
            if (this.pollingSubscription) {
                this.pollingSubscription.unsubscribe();
            }
            if (this.questionThreadId && this.questionThreadId !== "new") {
                this.startPolling();
            }
        }
    }

    private prepareInitialData(): void {
        // If questionThreadId is an empty string, it's likely an uninitialized state from the parent.
        // Treat it as "new" to prevent API calls with an empty ID.
        if (this.questionThreadId === "") {
            console.warn("ChatComponent: questionThreadId is an empty string. Coercing to 'new'.");
            this.questionThreadId = "new";
        }
        this.loadThread();
        this.loadMessages();
    }

    ngOnDestroy(): void {
        this.pollingSubscription.unsubscribe();
    }

    loadThread(): void {
        if (this.questionThreadId === "new") {
            this.currentThread = {
                id: '',
                creatorId: this.currentUserId,
                assignmentId: this.assignmentId,
                learningObjectId: this.learningObjectId,
                isClosed: false,
                visibility: VisibilityType.PRIVATE,
            } as QuestionThread;
            if(!this.assignmentId || !this.learningObjectId) {
                console.warn("ChatComponent: 'new' thread is missing assignmentId or learningObjectId.",
                            "assignmentId:", this.assignmentId, "learningObjectId:", this.learningObjectId);
            }
            return;
        }
        this.threadService.retrieveQuestionThreadById(this.questionThreadId)
            .subscribe(thread => {
                this.currentThread = thread;
            });
    }

    updateVisibility(newVisibility: VisibilityType): void {
        this.threadService.updateQuestionThread(this.questionThreadId, {
          isClosed: false,
          visibility: newVisibility
        }).subscribe()
        this.currentThread.visibility = newVisibility;
    }

    navigateToAssignment() {
        if (this.currentThread?.assignmentId) {
            let userType = this.authService.retrieveUserType();
            if (userType === 'teacher') {
                this.router.navigate(['teacher', 'assignments', this.currentThread.assignmentId]);
            } else {
                this.router.navigate(['student', 'assignments', this.currentThread.assignmentId]);
            }
        }
    }

    // Helper method to check if message belongs to current user
    isUserMessage(msg: Message): boolean {
        return msg.senderId === this.authService.retrieveUserId();
    }

    private scrollToBottom(): void {
        try {
            if (this.messagesContainer && this.messagesContainer.nativeElement) {
                // Use a small delay to ensure the DOM updates before scrolling
                setTimeout(() => {
                    this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
                }, 100); // Delay in milliseconds (100ms)
            }
        } catch(err) {
            console.error('Error scrolling to bottom:', err);
        }
    }

    loadMessages(): void {
        if (this.questionThreadId === "" || this.questionThreadId === "new") {
            this.messages = [];
            return;
        }
        this.fetchAndProcessMessages().subscribe(messages => {
          this.messages = messages;
          this.scrollToBottom();
        });
    }

    private fetchAndProcessMessages(): Observable<Message[]> {
        return this.messageService.retrieveMessagesByQuestion(this.questionThreadId).pipe(
          map(messages =>
            messages.sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
          ),
          tap(sortedMessages => {
            const uniqueUserIds = [...new Set(sortedMessages.map(m => m.senderId))];
            uniqueUserIds.forEach(id => {
              if (this.usernamesMap[id]) return;
              this.userService.userWithId(id).subscribe(user => {
                this.usernamesMap[id] = `${user.firstName} ${user.familyName}`;
              });
            });
          })
        );
    }
      

    sendMessage(): void {
        const trimmed = this.newMessageContent.trim();
        if (!trimmed) return;

        if(this.questionThreadId === "new") {
            this.threadService.createQuestionThread({
                    creatorId: this.currentUserId,
                    assignmentId: this.assignmentId,
                    learningObjectId: this.learningObjectId,
                    isClosed: false,
                    visibility: VisibilityType.PRIVATE,
                } as NewQuestionThread
            ).subscribe(thread => {
                this.questionThreadId = thread.id;
                this.loadThread();
                this.sendActualMessage(trimmed);
                this.startPolling(); // Start polling with the new ID
            });
        } else {
            this.sendActualMessage(trimmed);
        }
    }

    private sendActualMessage(content: string): void {
        const newMsg: NewMessage = {
            senderId: this.currentUserId,
            threadId: this.questionThreadId,
            createdAt: new Date(),
            content: content,
        };

        this.messageService.createMessage(newMsg).subscribe(messageId => {
            this.messages.push({ ...newMsg, id: messageId } as Message);
            this.newMessageContent = '';
            this.scrollToBottom();
        });
    }

    private startPolling(): void {
        if (this.pollingSubscription) {
            this.pollingSubscription.unsubscribe();
        }
        this.pollingSubscription = interval(5000).pipe(
            switchMap(() => {
                if (!this.questionThreadId || this.questionThreadId === "new") {
                    return of([]); // Don't poll for "new" or invalid IDs
                }
                return this.fetchAndProcessMessages();
            }),
            distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
        ).subscribe(messages => {
            this.messages = messages;
            this.scrollToBottom();
        });
    }
}