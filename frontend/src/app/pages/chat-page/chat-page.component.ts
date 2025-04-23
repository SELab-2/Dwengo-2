// import { Component } from '@angular/core';
// import { ChatComponent } from '../../components/chat/chat.component';
// import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';

// @Component({
//     selector: 'app-chat-page',
//     templateUrl: './chat-page.component.html',
//     styleUrls: ['./chat-page.component.less'],
//     standalone: true,
//     imports: [ChatComponent, AuthenticatedHeaderComponent],
// })
// export class ChatPageComponent {
//   mockThreadId = 'mock-thread-001'; // use something that triggers mock data
// }

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
      this.chatId = this.route.snapshot.paramMap.get('id') || '';
  
      this.assignmentService.retrieveAssignments().pipe(
        switchMap(assignments => {
            if (!assignments || !Array.isArray(assignments)) {
              console.log('Assignments response is not an array:', assignments);
            //   throw new Error('Invalid assignments response');
            }
            console.log('Assignments:', assignments);
            const threadRequests = assignments.map(a =>
                this.threadService.retrieveQuestionThreadsByAssignment(a.id)
            );
            console.log('Thread requests:', threadRequests);
            return forkJoin(threadRequests);
        }),
        map(threadArrays => {
            console.log('yo')
            const allThreads = threadArrays.flat();
            console.log('All threads:', allThreads);
            // Add mock thread for testing
            // allThreads.push({
            //     id: 'mock-thread-001',
            //     creatorId: this.authService.retrieveUserId() || '',
            //     assignmentId: 'mock-assignment',
            //     learningObjectId: 'mock-learning-object',
            //     isClosed: false,
            //     visibility: 'public',
            // } as QuestionThread);
    
            return allThreads;
        }),
        switchMap(allThreads => {
            const userId = this.authService.retrieveUserId() || '';
            console.log('User ID:', userId);
            console.log('All threads:', allThreads);
            const userThreads = allThreads.filter(t => t.creatorId === userId);
            console.log('User threads:', userThreads);
            this.questionThreads = userThreads;
            this.validChatId = !!this.chatId && userThreads.some(t => t.id === this.chatId);
            return of(true); // just end the stream
        })
      ).subscribe({
        error: (err) => {
          console.error('Failed to load threads:', err);
          this.validChatId = false;
        }
      });
    }
}