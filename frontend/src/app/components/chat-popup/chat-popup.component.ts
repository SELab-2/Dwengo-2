import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Overlay } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { QuestionThreadService } from '../../services/questionThread.service';
import { ChatComponent } from '../../components/chat/chat.component';
import { TemplateRef } from '@angular/core';

@Component({
  selector: 'app-chat-popup',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatToolbarModule,
    ChatComponent
  ],
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.less']
})
export class ChatPopupComponent {
  @Input() assignmentId!: string;
  @Input() currentLearningObjectId!: string;
  @Output() chatToggled = new EventEmitter<boolean>();

  @ViewChild('chatDialog') chatDialogTemplate!: TemplateRef<unknown>;

  private readonly chatService = inject(QuestionThreadService);
  private readonly dialog = inject(MatDialog);
  private readonly overlay = inject(Overlay);
  private readonly router = inject(Router);

  public currentThreadId: string = "";
  public isOpen = false;
  private chatDialogRef?: MatDialogRef<unknown>;

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
    this.close();
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
      next: (thread: any) => {
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