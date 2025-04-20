import { HttpClient, HttpHeaders } from '@angular/common/http';
import { QuestionService } from './question.service';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { of } from 'rxjs';
import { Question, NewQuestion, VisibilityType } from '../interfaces/question';
import { QuestionUpdate } from '../interfaces/question/questionUpdate';
import { QuestionResponse, QuestionResponseSingle } from '../interfaces/question/questionResponse';

describe('QuestionService', () => {
  const question: Question = {
    id: 'question-id',
    creatorId: 'creator-id',
    assignmentId: 'assignment-id',
    learningObjectId: undefined, // <- fixed
    isClosed: false,
    visibility: VisibilityType.PUBLIC,
    messageIds: [],
  };

  const newQuestion: NewQuestion = {
    creatorId: 'creator-id',
    assignmentId: 'assignment-id',
    learningObjectId: 'learning-object-id',
    isClosed: false,
    visibility: VisibilityType.PUBLIC,
  };

  const updatedQuestion: QuestionUpdate = {
    isClosed: true,
    visibility: VisibilityType.PRIVATE,
  };

  const questionResponse: QuestionResponse = {
    questions: [question.id],
  };

  const questionResponseSingle: QuestionResponseSingle = {
    id: question.id,
  };

  let http: jasmine.SpyObj<HttpClient>;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;
  let errorService: jasmine.SpyObj<ErrorService>;
  let service: QuestionService;

  beforeEach(() => {
    http = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch', 'delete']);
    errorService = jasmine.createSpyObj('ErrorService', ['pipeHandler', 'retrieveError', 'createError', 'deleteError', 'updateError']);
    errorService.pipeHandler.and.callFake(() => (source) => source);
    authenticationService = jasmine.createSpyObj('AuthenticationService', ['retrieveUserId', 'retrieveAuthenticationHeaders']);
    authenticationService.retrieveUserId.and.returnValue('creator-id');
    authenticationService.retrieveAuthenticationHeaders.and.returnValue({
      headers: new HttpHeaders().append('Authorization', `Bearer token`).append('Content-Type', 'application/json'),
    });

    service = new QuestionService(http, authenticationService, errorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve questions by assignment', () => {
    http.get.and.returnValue(of(questionResponse));
    spyOn(service, 'retrieveQuestionById').and.returnValue(of(question));
  
    service.retrieveQuestionsByAssignment('assignment-id').subscribe(result => {
      expect(result).toEqual([question]);
    });
  
    expect(http.get).toHaveBeenCalledWith(
        jasmine.stringMatching(/assignments\/assignment-id\/questions/),
        jasmine.any(Object)
    );
  });

  it('should retrieve a single question', () => {
    http.get.and.returnValue(of(question));
    service.retrieveQuestionById(question.id).subscribe(result => {
      expect(result).toEqual(question);
    });
  });

  it('should create a question', () => {
    http.post.and.returnValue(of(questionResponseSingle));
    service.createQuestion(newQuestion).subscribe(result => {
      expect(result).toEqual(jasmine.objectContaining({
        ...newQuestion,
        id: question.id,
      }));
    });
  });

  it('should update a question', () => {
    http.patch.and.returnValue(of({}));
    service.updateQuestion(question.id, updatedQuestion).subscribe(result => {
      expect(result).toEqual(updatedQuestion);
    });
  });

  it('should delete a question', () => {
    http.delete.and.returnValue(of({}));
    service.deleteQuestion(question.id).subscribe(result => {
      expect(result).toBeTrue();
    });
  });
});
