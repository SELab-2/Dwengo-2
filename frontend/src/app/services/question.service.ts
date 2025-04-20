import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { Question, NewQuestion, QuestionUpdate } from '../interfaces/question';
import { QuestionResponse, QuestionResponseSingle } from '../interfaces/question/questionResponse';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private API_URL = environment.API_URL;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorService: ErrorService,
  ) {}

  /**
   * Retrieve a single question by ID
   */
  retrieveQuestionById(id: string): Observable<Question> {
    const headers = this.authService.retrieveAuthenticationHeaders();

    return this.http.get<Question>(
      `${this.API_URL}/questions/${id}`,
      headers
    ).pipe(
      this.errorService.pipeHandler(
        this.errorService.retrieveError($localize `question`)
      )
    );
  }

  /**
   * Retrieve all questions associated with an assignment
   */
  retrieveQuestionsByAssignment(idParent: string): Observable<Question[]> {
    const headers = this.authService.retrieveAuthenticationHeaders();

    return this.http.get<QuestionResponse>(
      `${this.API_URL}/assignments/${idParent}/questions`,
      headers
    ).pipe(
      this.errorService.pipeHandler(
        this.errorService.retrieveError($localize `questions`)
      ),
      switchMap(response => 
        forkJoin(
            response.questions.map(id => 
                this.retrieveQuestionById(id)
            )
        )
      )
    );
  }

  /**
   * Create a new question
   */
  createQuestion(question: NewQuestion): Observable<Question> {
    const headers = this.authService.retrieveAuthenticationHeaders();

    return this.http.post<QuestionResponseSingle>(
      `${this.API_URL}/questions`,
      question,
      headers
    ).pipe(
      this.errorService.pipeHandler(
        this.errorService.createError($localize `question`)
      ),
      switchMap(response => of({
        ...question,
        id: response.id
      }))
    );
  }

  /**
   * Update an existing question
   */
  updateQuestion(id: string, question: QuestionUpdate): Observable<QuestionUpdate> {
    const headers = this.authService.retrieveAuthenticationHeaders();

    return this.http.patch<void>(
      `${this.API_URL}/questions/${id}`,
      question,
      headers
    ).pipe(
      this.errorService.pipeHandler(
        this.errorService.updateError($localize `question`)
      ),
      switchMap(() => of(question))
    );
  }

  /**
   * Delete a question
   */
  deleteQuestion(id: string): Observable<boolean> {
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
