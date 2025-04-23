import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuestionThreadService } from '../../services/questionThread.service';
import { AssignmentService } from '../../services/assignment.service';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { ChatComponent } from '../../components/chat/chat.component';
import { QuestionThread } from '../../interfaces/questionThread';
import { forkJoin, of, switchMap, map } from 'rxjs';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    RouterModule,
    ChatComponent,
    AuthenticatedHeaderComponent
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
  
    ngOnInit(): void {
    //   this.chatId = this.route.snapshot.paramMap.get('id') || '';
  
    //   this.assignmentService.retrieveAssignments().pipe(
        this.assignmentService.retrieveAssignments().pipe(
            switchMap(assignments => {
                if (!assignments || !Array.isArray(assignments)) {
                    console.error('Invalid assignments response:', assignments);
                    return of([]);
                }
                // console.log('Assignments:', assignments);
                const threadRequests = assignments.map(a =>
                    this.threadService.retrieveQuestionThreadsByAssignment(a.id)
                );
                // console.log('Thread requests:', threadRequests);
                return forkJoin(threadRequests);
            }),
            map(threadArrays => threadArrays.flat()),
            // switchMap(allThreads => {
            map(allThreads => {
                const userId = this.authService.retrieveUserId() || '';
                // console.log('User ID:', userId);
                // console.log('All threads:', allThreads);
                const userThreads = allThreads.filter(t => t.creatorId === userId);
                // console.log('User threads:', userThreads);
                this.questionThreads = userThreads;
                // this.validChatId = !!this.chatId && userThreads.some(t => t.id === this.chatId);
                // return of(true);
                return userThreads.map(t => t.id);
            })
        ).subscribe({
            next: validIds => {
                // Once threads are loaded, now start watching route changes
                this.route.paramMap.subscribe(params => {
                    const id = params.get('id') || '';
                    this.chatId = id;
                    this.validChatId = validIds.includes(id);
                });
            },
            error: (err) => {
                console.error('Failed to load threads:', err);
                this.validChatId = false;
            }
        });
    }
}