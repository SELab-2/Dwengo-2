import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Overlay } from '@angular/cdk/overlay';
import { NavigationStart, Router } from '@angular/router';
import { QuestionThreadService } from '../../services/questionThread.service';
import { ChatComponent } from '../../components/chat/chat.component';
import { TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { QuestionThread } from '../../interfaces/questionThread';

@Component({
  selector: 'app-chat-popup',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    ChatComponent,
  ],
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.less']
})
export class ChatPopupComponent implements OnDestroy {
  @Input() assignmentId!: string;
  @Input() currentLearningObjectId!: string;
  @Output() chatToggled = new EventEmitter<boolean>();

  @ViewChild('chatDialog') chatDialogTemplate!: TemplateRef<unknown>;
  private routerSubscription: Subscription;
  private chatDialogRef?: MatDialogRef<unknown>;

  public currentThreadId: string = "";
  public isOpen = false;

  constructor(
    private chatService: QuestionThreadService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private router: Router
  ) {
    // Subscribe to router events to close chat on navigation
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && this.isOpen) {
        this.close();
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  async open() {
    if (this.isOpen) {
      this.close();
      return;
    }

    await this.checkOrCreateThread();

    this.chatDialogRef = this.dialog.open(this.chatDialogTemplate, {
      width: '400px',
      height: '600px',
      panelClass: 'chat-dialog-container',
      position: { bottom: '80px', right: '20px' },
      hasBackdrop: false,
      disableClose: true,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      autoFocus: false
    });

    this.isOpen = true;
    this.chatToggled.emit(true);
    
    this.chatDialogRef.afterClosed().subscribe(() => {
      this.isOpen = false;
      this.chatToggled.emit(false);
    });
  }

  close() {
    if (this.chatDialogRef) {
      this.chatDialogRef.close();
    }
  }

  navigateToFullChat() {
    this.router.navigate(['/student/chat', this.currentThreadId]);
  }

  private async checkOrCreateThread() {
    if (!this.assignmentId) {
      this.currentThreadId = "new";
      return;
    }

    if (!this.currentLearningObjectId) {
      this.currentThreadId = "new";
      return;
    }

    this.chatService.retrieveQuestionThreadByStep(
      this.assignmentId,
      this.currentLearningObjectId
    ).subscribe({
      next: (thread: QuestionThread | null) => {
        if (thread && thread.id) {
          this.currentThreadId = thread.id;
        } else {
          this.currentThreadId = "new";
        }
      },
      error: () => {
        this.currentThreadId = "new";
      }
    });
  }
}