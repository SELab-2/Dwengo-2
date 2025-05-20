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
}
from '../interfaces/questionThread/questionThreadResponse';
import { QuestionThreadService } from './questionThread.service';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { AssignmentService } from './assignment.service';
import { MessageService } from './message.service';
import { ClassesService } from './classes.service';
import { LearningObjectService } from '../services/learningObject.service';
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
    lastMessageDate: new Date(),
    name: 'Default Thread Name'
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

  it('getThreadTitle combines class, assignment and LO names', done => {
    const thread: QuestionThread = { ...questionThread, assignmentId: 'a1', learningObjectId: 'lo1' };
    const assignmentMock = { classId: 'c1', className: 'CN', name: 'AN' };
    const classMock = { name: 'ClassName' };
    lo.getTitleOrFallback.and.returnValue(of('LOTitle'));

    assignment.retrieveAssignmentById.and.returnValue(of(assignmentMock as Assignment));
    classes.classWithId.and.returnValue(of(classMock as Class));

    service.getThreadTitle(thread).subscribe((title: string) => {
      expect(title).toBe('ClassName > AN > LOTitle');
      done();
    });
  });

  describe('loadSideBarQuestionThreads', () => {
    const dummyThreads: QuestionThread[] = [questionThread];

    beforeEach(() => {
      spyOn(service, 'initializeAllThreads').and.returnValue(of(void 0));
      spyOn(service, 'filterAndNameThreads').and.returnValue(of(dummyThreads));
    });

    it('should call initializeAllThreads then filterAndNameThreads', done => {
      assignment.retrieveAssignments.and.returnValue(of([]));

      service.loadSideBarQuestionThreads('assignment-id', false).subscribe(res => {
        // Corrected access to private property using 'unknown' first
        expect((service as unknown as { allThreadsCache: QuestionThread[] }).allThreadsCache).toBeDefined();
        expect(service.filterAndNameThreads).toHaveBeenCalledWith(
          (service as unknown as { allThreadsCache: QuestionThread[] }).allThreadsCache,
          'creator-id',
          'assignment-id',
          false
        );
        expect(res).toEqual(dummyThreads);
        done();
      });
    });
  });

  describe('filterAndNameThreads', () => {
    const assignA = { id: 'assignment-id', name: 'AN', classId: 'c1', className: 'CN' } as Assignment;

    // Type the spy directly
    let getThreadNameWithTimestampSpy: jasmine.Spy<(thread: QuestionThread, assignmentName: string) => Observable<string>>;

    beforeEach(() => {
      assignment.retrieveAssignments.and.returnValue(of([assignA]));

      getThreadNameWithTimestampSpy = spyOn(
        service as unknown as { getThreadNameWithTimestamp: (thread: QuestionThread, assignmentName: string) => Observable<string> },
        'getThreadNameWithTimestamp'
      ).and.callFake((thread: QuestionThread, assignmentName: string) => {
        return of(`${assignmentName} - generated for ${thread.id}`);
      });
    });

    it('should filter, name unnamed threads, and sort by lastMessageDate descending', done => {
      const namedThread: QuestionThread = {
        ...questionThread,
        id: '1',
        name: 'Existing Name',
        assignmentId: 'assignment-id',
        assignmentName: 'AN',
        lastMessageDate: new Date(1)
      };
      const unnamedThread: QuestionThread = {
        ...questionThread,
        id: '2',
        name: '',
        assignmentId: 'assignment-id',
        assignmentName: 'AN',
        lastMessageDate: new Date(2)
      };

      service.filterAndNameThreads([namedThread, unnamedThread], 'creator-id', 'assignment-id', false)
        .subscribe(result => {
          expect(result.length).toBe(2);
          expect(result[0].id).toBe('2');
          expect(result[0].name).toBe('AN - generated for 2');
          expect(result[1].id).toBe('1');
          expect(result[1].name).toBe('Existing Name');

          expect(getThreadNameWithTimestampSpy).toHaveBeenCalledTimes(1);
          expect(getThreadNameWithTimestampSpy).toHaveBeenCalledWith(unnamedThread, 'AN');
          done();
        });
    });

    it('should skip naming when all threads already have names', done => {
      const t1 = { ...questionThread, id: '1', name: 'N1', lastMessageDate: new Date(1), assignmentId: 'assignment-id', assignmentName: 'AN' };
      const t2 = { ...questionThread, id: '2', name: 'N2', lastMessageDate: new Date(2), assignmentId: 'assignment-id', assignmentName: 'AN' };

      service.filterAndNameThreads([t1, t2], 'creator-id', 'assignment-id', false)
        .subscribe(result => {
          expect(result.map(t => t.id)).toEqual(['2', '1']);
          expect(getThreadNameWithTimestampSpy).not.toHaveBeenCalled();
          done();
        });
    });

    it('should correctly filter threads based on showOtherChats and userType (student)', done => {
      auth.retrieveUserType.and.returnValue(UserType.STUDENT);

      const groupVisibleThread: QuestionThread = {
        ...questionThread,
        id: 'group1',
        visibility: VisibilityType.GROUP,
        creatorId: 'other-creator',
        assignmentId: 'assignment-id',
        assignmentName: 'AN',
        name: ''
      };
      const privateVisibleThread: QuestionThread = {
        ...questionThread,
        id: 'private1',
        visibility: VisibilityType.PRIVATE,
        creatorId: 'creator-id',
        assignmentId: 'assignment-id',
        assignmentName: 'AN',
        name: ''
      };
      const privateVisibleOtherUserThread: QuestionThread = {
        ...questionThread,
        id: 'private2',
        visibility: VisibilityType.PRIVATE,
        creatorId: 'some-other-creator',
        assignmentId: 'assignment-id',
        assignmentName: 'AN',
        name: ''
      };
      const otherAssignmentThread: QuestionThread = {
        ...questionThread,
        id: 'otherAssign',
        visibility: VisibilityType.GROUP,
        creatorId: 'creator-id',
        assignmentId: 'another-assignment-id',
        assignmentName: 'OA',
        name: ''
      };

      const studentThreadsScenario1 = [groupVisibleThread, privateVisibleThread, privateVisibleOtherUserThread, otherAssignmentThread];

      service.filterAndNameThreads(studentThreadsScenario1, 'creator-id', 'assignment-id', true)
        .subscribe(result => {
          expect(result.length).toBe(2);
          expect(result.some(t => t.id === 'group1')).toBeTrue();
          expect(result.some(t => t.id === 'otherAssign')).toBeTrue();
        });

      const studentThreadsScenario2 = [groupVisibleThread, privateVisibleThread, privateVisibleOtherUserThread, otherAssignmentThread];
      service.filterAndNameThreads(studentThreadsScenario2, 'creator-id', 'assignment-id', false)
        .subscribe(result => {
          expect(result.length).toBe(2);
          expect(result.some(t => t.id === 'private1')).toBeTrue();
          expect(result.some(t => t.id === 'otherAssign')).toBeTrue();
          done();
        });
    });


    it('should correctly filter threads based on showOtherChats and userType (teacher)', done => {
      auth.retrieveUserType.and.returnValue(UserType.TEACHER);

      const groupVisibleThread: QuestionThread = {
        ...questionThread,
        id: 'group1',
        visibility: VisibilityType.GROUP,
        creatorId: 'other-creator',
        assignmentId: 'assignment-id',
        assignmentName: 'AN',
        name: ''
      };
      const privateVisibleThread: QuestionThread = {
        ...questionThread,
        id: 'private1',
        visibility: VisibilityType.PRIVATE,
        creatorId: 'creator-id',
        assignmentId: 'assignment-id',
        assignmentName: 'AN',
        name: ''
      };
      const otherAssignmentThread: QuestionThread = {
        ...questionThread,
        id: 'otherAssign',
        assignmentId: 'other-assignment-id',
        assignmentName: 'OA',
        name: ''
      };

      const allThreadsForTeacherTest = [groupVisibleThread, privateVisibleThread, otherAssignmentThread];

      service.filterAndNameThreads(allThreadsForTeacherTest, 'creator-id', 'assignment-id', true)
        .subscribe(result => {
          expect(result.length).toBe(2);
          expect(result.some(t => t.id === 'group1')).toBeTrue();
          expect(result.some(t => t.id === 'private1')).toBeTrue();
          expect(getThreadNameWithTimestampSpy).toHaveBeenCalledWith(groupVisibleThread, 'AN');
          expect(getThreadNameWithTimestampSpy).toHaveBeenCalledWith(privateVisibleThread, 'AN');
        });

      service.filterAndNameThreads(allThreadsForTeacherTest, 'creator-id', 'assignment-id', false)
        .subscribe(result => {
          expect(result.length).toBe(3);
          expect(result.some(t => t.id === 'group1')).toBeTrue();
          expect(result.some(t => t.id === 'private1')).toBeTrue();
          expect(result.some(t => t.id === 'otherAssign')).toBeTrue();
          expect(getThreadNameWithTimestampSpy).toHaveBeenCalledWith(groupVisibleThread, 'AN');
          expect(getThreadNameWithTimestampSpy).toHaveBeenCalledWith(privateVisibleThread, 'AN');
          expect(getThreadNameWithTimestampSpy).toHaveBeenCalledWith(otherAssignmentThread, 'OA');
          done();
        });
    });
  });
});