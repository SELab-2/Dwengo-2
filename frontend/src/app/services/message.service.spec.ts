import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { of} from 'rxjs';
import { Message, NewMessage } from '../interfaces/message';
import { MessageUpdate } from '../interfaces/message/messageUpdate';
import { MessageResponseSingle } from '../interfaces/message/messageResponse';

describe('MessageService', () => {
  const message: Message = {
    id: 'message-id',
    senderId: 'user-id',
    threadId: 'question-id',
    content: 'Test message content',
    createdAt: new Date(),
  };

  const newMessage: NewMessage = {
    senderId: 'user-id',
    threadId: 'question-id',
    createdAt: new Date(),
    content: 'Test message content',
  };

  const messageResponseSingle: MessageResponseSingle = {
    id: message.id
  };

  const updatedMessage: MessageUpdate = {
    content: 'Updated message content'
  };

  let http: jasmine.SpyObj<HttpClient>;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;
  let errorService: jasmine.SpyObj<ErrorService>;
  let service: MessageService;

  beforeEach(() => {
    http = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch', 'delete']);
    errorService = jasmine.createSpyObj('ErrorService', ['pipeHandler', 'retrieveError', 'createError', 'deleteError', 'updateError']);
    errorService.pipeHandler.and.callFake(() => (source) => source);
    authenticationService = jasmine.createSpyObj('AuthenticationService', ['retrieveUserId', 'retrieveAuthenticationHeaders']);
    authenticationService.retrieveUserId.and.returnValue('user-id');
    authenticationService.retrieveAuthenticationHeaders.and.returnValue({
      headers: new HttpHeaders().append('Authorization', `Bearer token`).append('Content-Type', 'application/json'),
    });

    service = new MessageService(http, authenticationService, errorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a single message', () => {
    http.get.and.returnValue(of(message));
    service.retrieveMessageById(message.id).subscribe(result => {
      expect(result).toEqual(message);
    });
  });

  it('should retrieve messages by question', () => {
    const messageId = 'message-id';
    const message = {
      id: messageId,
      senderId: 'user-id',
      threadId: 'question-id',
      content: 'Test message content',
      createdAt: new Date(),
      isInstructor: false,
    } as Message;
  
    // First call: /questions/:id/messages → returns message IDs
    http.get.withArgs(jasmine.stringMatching(/\/questions\/.*\/messages/), jasmine.any(Object))
      .and.returnValue(of({ messages: [messageId] }));
  
    // Second call: /messages/:id → returns full message
    http.get.withArgs(jasmine.stringMatching(/\/messages\/.*$/), jasmine.any(Object))
      .and.returnValue(of(message));
  
    service.retrieveMessagesByQuestion('question-id').subscribe(result => {
      expect(result).toEqual([message]);
    });
  });
  

  it('should create a message', () => {
    http.post.and.returnValue(of(messageResponseSingle));
    service.createMessage(newMessage).subscribe(result => {
      expect(result).toEqual(message.id);
    });
  });

  it('should update a message', () => {
    http.patch.and.returnValue(of({}));
    service.updateMessage(message.id, updatedMessage).subscribe(result => {
      expect(result).toEqual(updatedMessage);
    });
  });

  it('should delete a message', () => {
    http.delete.and.returnValue(of({}));
    service.deleteMessage(message.id).subscribe(result => {
      expect(result).toBeTrue();
    });
  });
});
