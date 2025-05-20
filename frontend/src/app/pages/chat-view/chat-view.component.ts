import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuestionThreadService } from '../../services/questionThread.service';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ChatComponent } from '../../components/chat/chat.component';
import { QuestionThread } from '../../interfaces/questionThread';
import { AuthenticationService } from '../../services/authentication.service';
import { UserType } from '../../interfaces';
import { VisibilityType } from '../../interfaces/questionThread/questionThread';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-chat-view',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    RouterModule,
    ChatComponent,
    MatToolbarModule
  ],
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.less']
})
export class ChatViewComponent implements OnInit, OnChanges {
  @Input() compact: boolean = false;
  @Input() initialChatId: string | null = null;

  public currentSelectedChatId: string = '';
  public validChatId: boolean = false;
  public questionThreads: QuestionThread[] = [];
  public showOtherChats = false;
  public currentAssignmentId: string | null = null;
  public VisibilityType = VisibilityType;
  public userType: string = '';

  readonly USER_CHATS = $localize`:@@userChats:Show my chats`;
  readonly ASSIGNMENT_CHATS = $localize`:@@otherChats:Show other chats for this assignment`;
  readonly GROUP_CHATS = $localize`:@@groupChats:Show group chats`;
  public OTHER_CHATS: string = '';
  readonly UNNAMED_CHAT = $localize`:@@unnamedChatFallback:Unnamed Chat`;
  readonly INVALID_CHAT_ID = $localize`:@@invalidChatId:Select a chat`;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private threadService: QuestionThreadService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    const retrievedUserType = this.authService.retrieveUserType();
    this.userType = retrievedUserType === UserType.STUDENT ? 'student' : 'teacher';
    this.OTHER_CHATS = this.userType === 'teacher' ? this.ASSIGNMENT_CHATS : this.GROUP_CHATS;

    this.loadChats();

    if (!this.compact) {
      // Subscribe to route changes for chat ID.
      // This will not reload the sidebar, only update the selection.
      this.route.paramMap.subscribe(params => {
        this.currentSelectedChatId = params.get('id') || '';
        this.updateChatSelectionState();
      });
    } else {
      // In compact mode, if initialChatId is provided, set it.
      // updateChatSelectionState will be called once loadChats completes.
      if (this.initialChatId) {
        this.currentSelectedChatId = this.initialChatId;
      }
    }

    this.threadService.threadUpdate$.subscribe(threadUpdate => {
      this.questionThreads = this.questionThreads.map(thread => {
        if (thread.id === threadUpdate.id) {
          return { ...thread, visibility: threadUpdate.update.visibility };
        }
        return thread;
      });
      // Visibility change of a thread in the list doesn't require re-validating current selection
      // unless the selected thread itself is modified in a way that affects its validity (e.g., deleted).
      // For visibility, the badge will just update.
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.compact && changes['initialChatId'] && !changes['initialChatId'].firstChange) {
      this.currentSelectedChatId = this.initialChatId || '';
      this.updateChatSelectionState();
    }
  }

  public loadChats(): void {
    this.threadService.loadSideBarQuestionThreads(
      this.currentAssignmentId || '',
      this.showOtherChats
    ).subscribe({
      next: threads => {
        this.questionThreads = threads;
        this.updateChatSelectionState();
      },
      error: () => {
        this.questionThreads = [];
        this.updateChatSelectionState();
      }
    });
  }

  private updateChatSelectionState(): void {
    if (this.currentSelectedChatId && this.questionThreads.length > 0) {
      const currentThread = this.questionThreads.find(t => t.id === this.currentSelectedChatId);
      if (currentThread) {
        this.currentAssignmentId = currentThread.assignmentId || null;
        this.validChatId = true;
      } else {
        // currentSelectedChatId from route/input is not in the current list
        this.currentAssignmentId = null;
        this.validChatId = false;
      }
    } else {
      // No chat selected, or no threads loaded
      this.currentAssignmentId = null;
      this.validChatId = false;
    }
  }

  toggleChatVisibility(): void {
    this.showOtherChats = !this.showOtherChats;
    this.loadChats();
  }

  handleChatItemClick(threadId: string): void {
    if (this.compact) {
      this.currentSelectedChatId = threadId;
      this.updateChatSelectionState();
    } else {
      this.router.navigate(['/', this.userType, 'chat', threadId]);
    }
  }
}