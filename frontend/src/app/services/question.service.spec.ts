import { HttpClient, HttpHeaders } from '@angular/common/http';
import { QuestionThreadService } from './questionThread.service';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { of } from 'rxjs';
import { QuestionThread, NewQuestionThread, VisibilityType } from '../interfaces/questionThread';
import { QuestionThreadUpdate } from '../interfaces/questionThread/questionThreadUpdate';
import { QuestionThreadResponse, QuestionThreadResponseSingle } from '../interfaces/questionThread/questionThreadResponse';

describe('QuestionThreadService', () => {
  const questionThread: QuestionThread = {
    id: 'question-id',
    creatorId: 'creator-id',
    assignmentId: 'assignment-id',
    learningObjectId: undefined,
    isClosed: false,
    visibility: VisibilityType.PUBLIC,
    messageIds: [],
  };

  const newQuestionThread: NewQuestionThread = {
    creatorId: 'creator-id',
    assignmentId: 'assignment-id',
    learningObjectId: 'learning-object-id',
    isClosed: false,
    visibility: VisibilityType.PUBLIC,
  };

  const updatedQuestionThread: QuestionThreadUpdate = {
    isClosed: true,
    visibility: VisibilityType.PRIVATE,
  };

  const questionThreadResponse: QuestionThreadResponse = {
    questionThreads: [questionThread.id],
  };

  const questionThreadResponseSingle: QuestionThreadResponseSingle = {
    id: questionThread.id,
  };

  let http: jasmine.SpyObj<HttpClient>;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;
  let errorService: jasmine.SpyObj<ErrorService>;
  let service: QuestionThreadService;

  beforeEach(() => {
    http = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch', 'delete']);
    errorService = jasmine.createSpyObj('ErrorService', ['pipeHandler', 'retrieveError', 'createError', 'deleteError', 'updateError']);
    errorService.pipeHandler.and.callFake(() => (source) => source);
    authenticationService = jasmine.createSpyObj('AuthenticationService', ['retrieveUserId', 'retrieveAuthenticationHeaders']);
    authenticationService.retrieveUserId.and.returnValue('creator-id');
    authenticationService.retrieveAuthenticationHeaders.and.returnValue({
      headers: new HttpHeaders().append('Authorization', `Bearer token`).append('Content-Type', 'application/json'),
    });

    service = new QuestionThreadService(http, authenticationService, errorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve question threads by assignment', () => {
    http.get.and.returnValue(of(questionThreadResponse));
    spyOn(service, 'retrieveQuestionThreadById').and.returnValue(of(questionThread));
  
    service.retrieveQuestionThreadsByAssignment('assignment-id').subscribe(result => {
      expect(result).toEqual([questionThread]);
    });
  
    expect(http.get).toHaveBeenCalledWith(
        jasmine.stringMatching(/assignments\/assignment-id\/questions/),
        jasmine.any(Object)
    );
  });

  it('should retrieve a single question thread', () => {
    http.get.and.returnValue(of(questionThread));
    service.retrieveQuestionThreadById(questionThread.id).subscribe(result => {
      expect(result).toEqual(questionThread);
    });
  });

  it('should create a question thread', () => {
    http.post.and.returnValue(of(questionThreadResponseSingle));
    service.createQuestionThread(newQuestionThread).subscribe(result => {
      expect(result).toEqual(jasmine.objectContaining({
        ...newQuestionThread,
        id: questionThread.id,
      }));
    });
  });

  it('should update a question thread', () => {
    http.patch.and.returnValue(of({}));
    service.updateQuestionThread(questionThread.id, updatedQuestionThread).subscribe(result => {
      expect(result).toEqual(updatedQuestionThread);
    });
  });

  it('should delete a question thread', () => {
    http.delete.and.returnValue(of({}));
    service.deleteQuestionThread(questionThread.id).subscribe(result => {
      expect(result).toBeTrue();
    });
  });
});
