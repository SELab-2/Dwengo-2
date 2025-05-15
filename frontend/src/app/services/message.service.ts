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

  private messageMessage = $localize`message`;

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
        this.errorService.retrieveError(this.messageMessage)
      )
    );
  }

  /**
   * Retrieve all messages associated with a specific question
   */
  retrieveMessagesByQuestion(idParent: string): Observable<Message[]> {
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
  createMessage(message: NewMessage): Observable<string> {
    const headers = this.authService.retrieveAuthenticationHeaders();

    return this.http.post<MessageResponseSingle>(
      `${this.API_URL}/messages`,
      message,
      headers
    ).pipe(
      this.errorService.pipeHandler(
        this.errorService.createError(this.messageMessage)
      ),
      switchMap(response => of(
        response.id
      ))
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
        this.errorService.updateError(this.messageMessage)
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
        this.errorService.deleteError(this.messageMessage)
      ),
      switchMap(() => of(true))
    );
  }
}
