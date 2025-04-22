import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { Message, NewMessage } from '../interfaces/message';
import { MessageUpdate } from '../interfaces/message/messageUpdate';
import { MessageResponse, MessageResponseSingle } from '../interfaces/message/messageResponse';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private API_URL = environment.API_URL;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorService: ErrorService
  ) {}

  /**
   * Retrieve a single message by ID
   */
  retrieveMessageById(id: string): Observable<Message> {
    const headers = this.authService.retrieveAuthenticationHeaders();

    return this.http.get<Message>(
      `${this.API_URL}/messages/${id}`,
      headers
    ).pipe(
      this.errorService.pipeHandler(
        this.errorService.retrieveError($localize`message`)
      )
    );
  }

  /**
   * Retrieve all messages associated with a specific question
   */
  retrieveMessagesByQuestion(idParent: string): Observable<Message[]> {
    if (idParent === 'mock-thread-001') { // Mock data for testing
      // This is a mock thread ID. In a real application, you would remove this check.
      return of([
        {
          id: 'msg1',
          creatorId: 'u1',
          questionId: idParent,
          createdAt: new Date(Date.now() - 60000),
          content: 'Hey there! This is a mock message.',
          isInstructor: false,
        },
        {
          id: 'msg2',
          creatorId: 'u2',
          questionId: idParent,
          createdAt: new Date(),
          content: 'Hello! This one is from an instructor.',
          isInstructor: true,
        }
      ]);
    } // End of mock data
    const headers = this.authService.retrieveAuthenticationHeaders();

    return this.http.get<MessageResponse>(
      `${this.API_URL}/questions/${idParent}/messages`,
      headers
    ).pipe(
      this.errorService.pipeHandler(
        this.errorService.retrieveError($localize`messages`)
      ),
      switchMap(response => 
        forkJoin(
            response.messages.map(id => 
                this.retrieveMessageById(id)
            )
        )
    )
    );
  }

  /**
   * Create a new message
   */
  createMessage(message: NewMessage): Observable<Message> {
    const headers = this.authService.retrieveAuthenticationHeaders();

    return this.http.post<MessageResponseSingle>(
      `${this.API_URL}/messages`,
      message,
      headers
    ).pipe(
      this.errorService.pipeHandler(
        this.errorService.createError($localize`message`)
      ),
      switchMap(response => of({
        ...message,
        id: response.id,
        createdAt: new Date()
      }))
    );
  }

  /**
   * Update a message
   */
  updateMessage(id: string, update: MessageUpdate): Observable<MessageUpdate> {
    const headers = this.authService.retrieveAuthenticationHeaders();

    return this.http.patch<void>(
      `${this.API_URL}/messages/${id}`,
      update,
      headers
    ).pipe(
      this.errorService.pipeHandler(
        this.errorService.updateError($localize`message`)
      ),
      switchMap(() => of(update))
    );
  }

  /**
   * Delete a message
   */
  deleteMessage(id: string): Observable<boolean> {
    const headers = this.authService.retrieveAuthenticationHeaders();

    return this.http.delete<void>(
      `${this.API_URL}/messages/${id}`,
      headers
    ).pipe(
      this.errorService.pipeHandler(
        this.errorService.deleteError($localize`message`)
      ),
      switchMap(() => of(true))
    );
  }
}
