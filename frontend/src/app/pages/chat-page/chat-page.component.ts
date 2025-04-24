import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuestionThreadService } from '../../services/questionThread.service';
import { AssignmentService } from '../../services/assignment.service';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ChatComponent } from '../../components/chat/chat.component';
import { QuestionThread } from '../../interfaces/questionThread';
import { forkJoin, of, switchMap, map } from 'rxjs';
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
    private readonly route = inject(ActivatedRoute);
    private readonly threadService = inject(QuestionThreadService);
    private readonly assignmentService = inject(AssignmentService);
    private readonly authService = inject(AuthenticationService);
  
    public chatId: string = '';
    public validChatId: boolean = false;
    public questionThreads: QuestionThread[] = [];
    public showPublicChats = false;
    public currentLearningObjectId: string | null = null;
  
    ngOnInit(): void {
        this.loadChats();
        
        // Watch for route changes to get current thread's learning object ID
        this.route.paramMap.subscribe(params => {
            this.chatId = params.get('id') || '';
            this.updateCurrentLearningObjectId();
        });
    }

    private loadChats(): void {
        this.assignmentService.retrieveAssignments().pipe(
            switchMap(assignments => {
                if (!assignments || !Array.isArray(assignments)) {
                    return of([]);
                }
                const threadRequests = assignments.map(a => 
                    this.threadService.retrieveQuestionThreadsByAssignment(a.id)
                );
                return forkJoin(threadRequests);
            }),
            map(threadArrays => threadArrays.flat()),
            map(allThreads => {
                const userId = this.authService.retrieveUserId() || '';
                return this.filterThreads(allThreads, userId);
            })
        ).subscribe({
            next: () => this.updateCurrentLearningObjectId(),
            error: (err) => console.error('Failed to load threads:', err)
        });
    }

    private filterThreads(allThreads: QuestionThread[], userId: string): string[] {
        if (this.showPublicChats) {
            // Filter public/group chats for current learning object
            this.questionThreads = allThreads.filter(t => 
                t.learningObjectId === this.currentLearningObjectId &&
                (t.visibility === VisibilityType.GROUP || 
                 t.visibility === VisibilityType.PUBLIC)
            ).sort((a, b) => {
                // Group chats first, then public
                if (a.visibility === VisibilityType.GROUP && 
                    b.visibility !== VisibilityType.GROUP) return -1;
                if (b.visibility === VisibilityType.GROUP && 
                    a.visibility !== VisibilityType.GROUP) return 1;
                return 0;
            });
        } else {
            // Show only user's chats
            this.questionThreads = allThreads.filter(t => t.creatorId === userId);
        }
        return this.questionThreads.map(t => t.id);
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