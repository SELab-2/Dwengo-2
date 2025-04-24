import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';
import { BehaviorSubject, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { QuestionThread, NewQuestionThread, QuestionThreadUpdate, VisibilityType } from '../interfaces/questionThread';
import { QuestionThreadResponse, QuestionThreadResponseSingle } from '../interfaces/questionThread/questionThreadResponse';

@Injectable({
  providedIn: 'root'
})
export class QuestionThreadService {

  private API_URL = environment.API_URL;
  private threadUpdateSubject = new BehaviorSubject<{id: String, update: QuestionThreadUpdate}>(
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
  ) {}

  /**
   * Retrieve a single question thread by ID
   */
  retrieveQuestionThreadById(id: string): Observable<QuestionThread> {
    const headers = this.authService.retrieveAuthenticationHeaders();

    return this.http.get<QuestionThread>(
      `${this.API_URL}/questions/${id}`,
      headers
    ).pipe(
      tap(() => console.log('Retrieving question thread with ID:', id)),
      tap(response => console.log('Question thread response:', response)),
      this.errorService.pipeHandler(
        this.errorService.retrieveError($localize `question thread`)
      )
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
        this.errorService.retrieveError($localize `question threads`)
      ),
      switchMap(response => {
        console.log('Question threads response:', response);
        
        const threadIds = response?.threads || [];
        if (threadIds.length === 0) {
          console.log('No question threads found for assignment ID:', idParent);
          return of([]); // return empty array if there are no threads
        }

        return forkJoin(
          threadIds.map(id => this.retrieveQuestionThreadById(id))
        );
      }),
    )
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
        this.errorService.createError($localize `question thread`)
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
        this.errorService.updateError($localize`question`)
      ),
      switchMap(() => {
        return of(question);
      })
    );
    const threadUpdate: {id: String, update: QuestionThreadUpdate} = {
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
        this.errorService.deleteError($localize `question`)
      ),
      switchMap(() => of(true))
    );
  }
}
