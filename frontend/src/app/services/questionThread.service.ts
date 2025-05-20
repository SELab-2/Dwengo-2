import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { AssignmentService } from './assignment.service';
import { MessageService } from './message.service';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, combineLatest, defer, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { QuestionThread, NewQuestionThread, QuestionThreadUpdate, VisibilityType } from '../interfaces/questionThread';
import { QuestionThreadResponse, QuestionThreadResponseSingle } from '../interfaces/questionThread/questionThreadResponse';
import { ClassesService } from './classes.service';
import { LearningObjectService } from './learningObject.service';
import { HtmlType, LearningObjectRequest } from '../interfaces/learning-object';

@Injectable({
  providedIn: 'root'
})
export class QuestionThreadService {

  private API_URL = environment.API_URL;
  private threadUpdateSubject = new BehaviorSubject<{id: string, update: QuestionThreadUpdate}>(
    {
      id: '',
      update: {
        isClosed: false,
        visibility: VisibilityType.PRIVATE,
      } as QuestionThreadUpdate
    }
  );
  threadUpdate$ = this.threadUpdateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorService: ErrorService,
    private assignmentService: AssignmentService,
    private messageService: MessageService,
    private classesService: ClassesService,
    private learningObjectService: LearningObjectService
  ) {}

  private questionThreadMessage = $localize `:@@questionThread:question thread`;
  private questionThreadsMessage = $localize `:@@questionThreads:question threads`;
  private questionMessage = $localize `:@@question:question`;

  /**
   * Retrieve a single question thread by ID
   */
  retrieveQuestionThreadById(id: string): Observable<QuestionThread> {
    const headers = this.authService.retrieveAuthenticationHeaders();

    return this.http.get<QuestionThread>(
      `${this.API_URL}/questions/${id}`,
      headers
    ).pipe(
      // tap(() => console.log('Retrieving question thread with ID:', id)),
      // tap(response => console.log('Question thread response:', response)),
      this.errorService.pipeHandler(
        this.errorService.retrieveError(this.questionThreadMessage)
      )
    );
  }

  retrieveQuestionThreadByStep(
    assignmentId: string,
    learningObjectId: string
  ): Observable<QuestionThread | null> {
    const userId = this.authService.retrieveUserId() || '';
    return this.retrieveQuestionThreadsByAssignment(assignmentId).pipe(
      switchMap(threads => {
        if (!threads || threads.length === 0) {
            return of(null);
        }
        const filteredThreads = threads.filter(thread =>
            thread.learningObjectId === learningObjectId && thread.creatorId === userId
        );
        if (filteredThreads.length === 0) {
            return of(null); // No specific thread found for this step/user
        }
        const foundThread = filteredThreads[0];
        // If a thread object is found but has no ID, it's problematic; treat as not found for ID-based retrieval.
        return foundThread.id ? of(foundThread) : of(null);
      })
    );
  }

  /**
   * Retrieve all question threads associated with an assignment
   */
  retrieveQuestionThreadsByAssignment(idParent: string): Observable<QuestionThread[]> {
    const headers = this.authService.retrieveAuthenticationHeaders();

    return this.http.get<QuestionThreadResponse>(
      `${this.API_URL}/assignments/${idParent}/questions`,
      headers
    ).pipe(
      this.errorService.pipeHandler(
        this.errorService.retrieveError(this.questionThreadsMessage)
      ),
      switchMap(response => {
        // console.log('Question threads response:', response);
        
        const threadIds = response?.threads || [];
        if (threadIds.length === 0) {
          return of([]); // return empty array if there are no threads
        }

        return forkJoin(
          threadIds.map(id => this.retrieveQuestionThreadById(id))
        );
      }),
    )
  }

  /**
  * Load and filter question threads for the authenticated user or current learning object
  */
  loadSideBarQuestionThreads(
    currentAssignmentId: string,
    showOtherChats: boolean
  ): Observable<QuestionThread[]> {
    return this.assignmentService.retrieveAssignments().pipe(
      switchMap(assignments => {
        if (!assignments?.length) {
          return of([]);
        }

        const threadRequests = assignments.map(a => 
          this.retrieveQuestionThreadsByAssignment(a.id).pipe(
            switchMap(threads => {
              if (!threads.length) return of([]);
              
              const threadWithNames$ = threads.map(thread => 
                this.getThreadNameWithTimestamp(thread, a.name).pipe(
                  map(name => ({ ...thread, name }))
              ));
              return forkJoin(threadWithNames$);
            })
          )
        );
        return forkJoin(threadRequests);
      }),
      map(threadArrays => threadArrays.flat()),
      map(allThreads => {
        const userId = this.authService.retrieveUserId() || '';
        return this.filterThreads(allThreads, userId, currentAssignmentId, showOtherChats);
      }),
      this.errorService.pipeHandler(
        this.errorService.retrieveError($localize`loading user threads`)
      )
    );
  }

  /**
  * Filter threads based on visibility or ownership
  */
  filterThreads(
    allThreads: QuestionThread[],
    userId: string,
    currentAssignmentId: string,
    showOtherChats: boolean
  ): QuestionThread[] {
    const sortByLatestMessage = (a: QuestionThread, b: QuestionThread) => {
      const dateA = new Date(a.lastMessageDate || 0).getTime();
      const dateB = new Date(b.lastMessageDate || 0).getTime();
      return dateB - dateA; // descending order
    };

    if (showOtherChats) {
      if (this.authService.retrieveUserType() === 'student') {
        return allThreads
          .filter(t =>
            // t.learningObjectId === currentLearningObjectId &&
            (t.visibility === VisibilityType.GROUP)
          )
          .sort(sortByLatestMessage);
      } else {
        return allThreads
          .filter(t =>
            t.assignmentId === currentAssignmentId
          )
          .sort(sortByLatestMessage);
      }
    } else {
      if (this.authService.retrieveUserType() === 'student') {
        return allThreads
          .filter(t => t.creatorId === userId)
          .sort(sortByLatestMessage);
      } else {
        return allThreads
          .sort(sortByLatestMessage);
      }
    }
  }

  getThreadTitle(thread: QuestionThread): Observable<string> {
    return this.assignmentService.retrieveAssignmentById(thread.assignmentId).pipe(
      switchMap(assignment => {
        if (!assignment) return of('The spiders are back.'); // this should never happen

        return this.classesService.classWithId(assignment.classId).pipe(
          map(ci => ci?.name ?? assignment.className ?? '???'),
          catchError(() => of(assignment.className ?? '???')),
          switchMap(className =>
            this.learningObjectService
              .getTitleOrFallback(thread.learningObjectId, thread.learningObjectId)
              .pipe(
                map(lot => `${className} > ${assignment.name} > ${lot}`),
              )
          )
        );
      })
    );
  }

  private getThreadNameWithTimestamp(thread: QuestionThread, assignmentName: string): Observable<string> {
  // If no messages, just return basic name
  if (!thread.messageIds || thread.messageIds.length === 0) {
    return of(`${assignmentName} - ${thread.id}`);
  }

  // Retrieve all messages and find the latest one
  return forkJoin(thread.messageIds.map(id => this.messageService.retrieveMessageById(id))).pipe(
    map(messages => {
      const latestMessage = messages.reduce((latest, current) => {
        const latestDate = new Date(latest.createdAt || 0);
        const currentDate = new Date(current.createdAt || 0);
        return currentDate > latestDate ? current : latest;
      });
      thread.lastMessageDate = latestMessage.createdAt;
      const dateStr = latestMessage.createdAt ? 
        new Date(latestMessage.createdAt).toLocaleDateString() : 
        '';
      return `${dateStr} - ${assignmentName} - ${thread.id}`;
    }),
    this.errorService.pipeHandler(
      this.errorService.retrieveError(this.questionMessage)
    )
  );
}

  /**
   * Create a new question thread
   */
  createQuestionThread(questionThread: NewQuestionThread): Observable<QuestionThread> {
    const headers = this.authService.retrieveAuthenticationHeaders();

    return this.http.post<QuestionThreadResponseSingle>(
      `${this.API_URL}/questions`,
      questionThread,
      headers
    ).pipe(
      this.errorService.pipeHandler(
        this.errorService.createError(this.questionThreadMessage)
      ),
      switchMap(response => of({
        ...questionThread,
        id: response.id
      }))
    );
  }

  /**
   * Update an existing question
   */
  updateQuestionThread(id: string, question: QuestionThreadUpdate): Observable<QuestionThreadUpdate> {
    const headers = this.authService.retrieveAuthenticationHeaders();
    console.log('Updating question thread with ID:', id, 'and data:', question);
  
    const result =  this.http.patch<void>(
      `${this.API_URL}/questions/${id}`,
      question,
      headers
    ).pipe(
      tap(() => console.log('[PATCH] Question updated successfully')),
      this.errorService.pipeHandler(
        this.errorService.updateError(this.questionMessage)
      ),
      switchMap(() => {
        return of(question);
      })
    );
    const threadUpdate: {id: string, update: QuestionThreadUpdate} = {
      id: id,
      update: {
        isClosed: question.isClosed,
        visibility: question.visibility
      } as QuestionThreadUpdate
    };
    this.threadUpdateSubject.next(threadUpdate);
    return result;
  }

  /**
   * Delete a question
   */
  deleteQuestionThread(id: string): Observable<boolean> {
    const headers = this.authService.retrieveAuthenticationHeaders();

    return this.http.delete<void>(
      `${this.API_URL}/questions/${id}`,
      headers
    ).pipe(
      this.errorService.pipeHandler(
        this.errorService.deleteError(this.questionMessage)
      ),
      switchMap(() => of(true))
    );
  }
}
