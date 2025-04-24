import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuestionThreadService } from '../../services/questionThread.service';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ChatComponent } from '../../components/chat/chat.component';
import { QuestionThread } from '../../interfaces/questionThread';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';
import { AuthenticationService } from '../../services/authentication.service';
import { VisibilityType } from '../../interfaces/questionThread/questionThread';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    RouterModule,
    ChatComponent,
    AuthenticatedHeaderComponent,
  ],
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.less']
})
export class ChatPageComponent implements OnInit {
    public chatId: string = '';
    public validChatId: boolean = false;
    public questionThreads: QuestionThread[] = [];
    public showPublicChats = false;
    public currentLearningObjectId: string | null = null;
    public VisibilityType = VisibilityType; // For template binding

    constructor(
        private route: ActivatedRoute,
        private threadService: QuestionThreadService,
        private authService: AuthenticationService
    ){}
  
    ngOnInit(): void {
        this.loadChats();
        
        // Watch for route changes to get current thread's learning object ID
        this.route.paramMap.subscribe(params => {
            this.chatId = params.get('id') || '';
            this.updateCurrentLearningObjectId();
        });

        this.threadService.threadUpdate$.subscribe(threadUpdate => {
            // Update the sidebar badges based on the latest thread visibilities
            // console.log('[Sidebar Update] Got update for thread:', threadUpdate);
            this.questionThreads = this.questionThreads.map(thread => {
                if (thread.id === threadUpdate.id) {
                    // console.log('[Sidebar Update] Updating thread:', thread.id, 'with visibility:', threadUpdate.update.visibility);
                    return { ...thread, visibility: threadUpdate.update.visibility };
                }
                return thread;
            });
        });
    }

    private loadChats(): void {
        const userId = this.authService.retrieveUserId();
        this.threadService.loadSideBarQuestionThreads(
          userId || '',
          this.currentLearningObjectId || '',
          this.showPublicChats
        ).subscribe({
          next: threads => {
            this.questionThreads = threads;
            this.updateCurrentLearningObjectId();
          },
        });
    }

    private updateCurrentLearningObjectId(): void {
        if (this.chatId) {
            const currentThread = this.questionThreads.find(t => t.id === this.chatId);
            this.currentLearningObjectId = currentThread?.learningObjectId || null;
        }
        this.validChatId = this.questionThreads.some(t => t.id === this.chatId);
    }

    toggleChatVisibility(): void {
        this.showPublicChats = !this.showPublicChats;
        this.loadChats(); // Reload chats with new filter
    }
}