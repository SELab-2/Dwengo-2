import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import {
  VisibilityType,
  QuestionThread,
  NewQuestionThread,
  QuestionThreadUpdate
} from '../interfaces/questionThread';
import {
  QuestionThreadResponse,
  QuestionThreadResponseSingle
} from '../interfaces/questionThread/questionThreadResponse';
import { QuestionThreadService } from './questionThread.service';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { AssignmentService } from './assignment.service';
import { MessageService } from './message.service';
import { ClassesService } from './classes.service';
import { LearningObjectService } from './learningObject.service';
import { UserType } from '../interfaces/user';
import { Assignment } from '../interfaces/assignment';
import { Class } from '../interfaces/classes/class';

describe('QuestionThreadService', () => {
  let service: QuestionThreadService;
  let http: jasmine.SpyObj<HttpClient>;
  let auth: jasmine.SpyObj<AuthenticationService>;
  let error: jasmine.SpyObj<ErrorService>;
  let assignment: jasmine.SpyObj<AssignmentService>;
  let message: jasmine.SpyObj<MessageService>;
  let classes: jasmine.SpyObj<ClassesService>;
  let lo: jasmine.SpyObj<LearningObjectService>;

  const questionThread: QuestionThread = {
    id: 'question-id',
    creatorId: 'creator-id',
    assignmentId: 'assignment-id',
    learningObjectId: 'object-id',
    isClosed: false,
    visibility: VisibilityType.GROUP,
    messageIds: [],
  };

  const newThreadPayload: NewQuestionThread = {
    creatorId: 'creator-id',
    assignmentId: 'assignment-id',
    learningObjectId: 'learning-object-id',
    isClosed: false,
    visibility: VisibilityType.GROUP,
  };

  const updatePayload: QuestionThreadUpdate = {
    isClosed: true,
    visibility: VisibilityType.PRIVATE,
  };

  const responseList: QuestionThreadResponse = {
    threads: [questionThread.id],
  };

  const responseSingle: QuestionThreadResponseSingle = {
    id: questionThread.id,
  };

  beforeEach(() => {
    http = jasmine.createSpyObj<HttpClient>('HttpClient', ['get', 'post', 'patch', 'delete']);
    error = jasmine.createSpyObj<ErrorService>('ErrorService', ['pipeHandler', 'retrieveError', 'createError', 'updateError', 'deleteError']);
    error.pipeHandler.and.callFake(() => <T>(source: Observable<T>) => source);
    auth = jasmine.createSpyObj<AuthenticationService>('AuthenticationService', ['retrieveUserId', 'retrieveAuthenticationHeaders', 'retrieveUserType']);
    auth.retrieveUserId.and.returnValue('creator-id');
    auth.retrieveAuthenticationHeaders.and.returnValue({ headers: new HttpHeaders() });
    auth.retrieveUserType.and.returnValue(UserType.TEACHER);
    assignment = jasmine.createSpyObj<AssignmentService>('AssignmentService', ['retrieveAssignments', 'retrieveAssignmentById']);
    message = jasmine.createSpyObj<MessageService>('MessageService', ['retrieveMessageById']);
    classes = jasmine.createSpyObj<ClassesService>('ClassesService', ['classWithId']);
    lo = jasmine.createSpyObj<LearningObjectService>('LearningObjectService', ['getTitleOrFallback']);

    service = new QuestionThreadService(http, auth, error, assignment, message, classes, lo);
  });

  it('retrieveQuestionThreadById should GET thread', done => {
    http.get.and.returnValue(of(questionThread));
    service.retrieveQuestionThreadById(questionThread.id).subscribe(res => {
      expect(res).toEqual(questionThread);
      done();
    });
    expect(http.get).toHaveBeenCalledWith(
      jasmine.stringMatching(/questions\/question-id$/),
      jasmine.any(Object)
    );
  });

  it('retrieveQuestionThreadsByAssignment should return threads list', done => {
    http.get.and.returnValue(of(responseList));
    spyOn(service, 'retrieveQuestionThreadById').and.returnValue(of(questionThread));
    service.retrieveQuestionThreadsByAssignment('assignment-id').subscribe(res => {
      expect(res).toEqual([questionThread]);
      done();
    });
  });

  it('createQuestionThread should POST and map response', done => {
    http.post.and.returnValue(of(responseSingle));
    service.createQuestionThread(newThreadPayload).subscribe(res => {
      expect(res).toEqual({ ...newThreadPayload, id: responseSingle.id });
      done();
    });
  });

  it('updateQuestionThread should PATCH, emit update, and return payload', done => {
    const updateSpy = spyOn(service['threadUpdateSubject'], 'next').and.callThrough();
    http.patch.and.returnValue(of({}));
    service.updateQuestionThread('question-id', updatePayload).subscribe(res => {
      expect(res).toEqual(updatePayload);
      expect(updateSpy).toHaveBeenCalledWith({ id: 'question-id', update: updatePayload });
      done();
    });
  });

  it('deleteQuestionThread should DELETE and return true', done => {
    http.delete.and.returnValue(of({}));
    service.deleteQuestionThread('question-id').subscribe(res => {
      expect(res).toBeTrue();
      done();
    });
  });

  it('retrieveQuestionThreadByStep returns null when no threads', done => {
    spyOn(service, 'retrieveQuestionThreadsByAssignment').and.returnValue(of([]));
    service.retrieveQuestionThreadByStep('a1', 'l1').subscribe(res => {
      expect(res).toBeNull();
      done();
    });
  });

  it('retrieveQuestionThreadByStep finds matching thread', done => {
    const thread: QuestionThread = { ...questionThread, assignmentId: 'a1', learningObjectId: 'l1' };
    spyOn(service, 'retrieveQuestionThreadsByAssignment').and.returnValue(of([thread]));
    service.retrieveQuestionThreadByStep('a1', 'l1').subscribe(res => {
      expect(res).toEqual(thread);
      done();
    });
  });

  it('filterThreads filters and sorts for teacher without showOtherChats', () => {
    const threads: QuestionThread[] = [
      { ...questionThread, id: '1', creatorId: 'u2', lastMessageDate: new Date(1) },
      { ...questionThread, id: '2', creatorId: 'u1', lastMessageDate: new Date(2) }
    ];
    const res = service.filterThreads(threads, 'u1', 'a1', false);
    expect(res.map(t => t.id)).toEqual(['2', '1']);
  });

  it('getThreadTitle combines class, assignment and LO names', done => {
    const thread: QuestionThread = { ...questionThread, assignmentId: 'a1', learningObjectId: 'lo1' };
    const assignmentMock = { classId: 'c1', className: 'CN', name: 'AN' };
    const classMock = { name: 'ClassName' };
    assignment.retrieveAssignmentById.and.returnValue(of(assignmentMock as Assignment));
    classes.classWithId.and.returnValue(of(classMock as Class));
    lo.getTitleOrFallback.and.returnValue(of('LOTitle'));
    service.getThreadTitle(thread).subscribe((title: string) => {
      expect(title).toBe('ClassName > AN > LOTitle');
      done();
    });
  });
});
