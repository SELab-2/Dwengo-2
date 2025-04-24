import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
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
import { QuestionThread, VisibilityType } from '../../interfaces/questionThread';
import { QuestionThreadService } from '../../services/questionThread.service';

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
    ]
})
export class ChatComponent implements OnInit, OnChanges {
    @Input() questionThreadId!: string;
    @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

    public messages: Message[] = [];
    public newMessageContent = '';
    public currentUserId: string = '';
    public usernamesMap: { [id: string]: string } = {};
    public currentThread: QuestionThread = {} as QuestionThread;
    public showVisibilityMenu = false;
    public VisibilityType = VisibilityType; // For template binding

    constructor(
        private messageService: MessageService,
        private threadService: QuestionThreadService,
        private authService: AuthenticationService,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.currentUserId = this.authService.retrieveUserId() || '';

        if (!this.currentUserId) {
            console.error('Could not retrieve user ID');
        }

        this.loadMessages();
        this.loadThread();
    }

    loadThread(): void {
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

    ngOnChanges(): void {
        this.loadMessages();
        this.loadThread();
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
        this.messageService.retrieveMessagesByQuestion(this.questionThreadId).subscribe(messages => {
            this.messages = messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

            const uniqueUserIds = [...new Set(messages.map(m => m.senderId))];
            uniqueUserIds.forEach(id => {
                if (this.usernamesMap[id]) return; // Skip if already fetched
                this.userService.userWithId(id).subscribe(user => {
                    this.usernamesMap[id] = user.firstName + ' ' + user.familyName;
                });
            });
            this.scrollToBottom();
        });
    }

    sendMessage(): void {
        const trimmed = this.newMessageContent.trim();
        if (!trimmed) return;

        const newMsg: NewMessage = {
            senderId: this.currentUserId,
            threadId: this.questionThreadId,
            createdAt: new Date(),
            content: trimmed,
        };

        this.messageService.createMessage(newMsg).subscribe(messageId => {
            this.messages.push(
                {
                    id: messageId,
                    senderId: this.currentUserId,
                    threadId: this.questionThreadId,
                    createdAt: new Date(),
                    content: trimmed,
                } as Message
            );
            this.newMessageContent = '';
            this.scrollToBottom();
        });
    }
}