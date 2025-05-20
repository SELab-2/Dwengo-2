import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { MessageService } from '../../services/message.service';
import { QuestionThreadService } from '../../services/questionThread.service';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { QuestionThread, VisibilityType } from '../../interfaces/questionThread';
import { UserType } from '../../interfaces';
import { Message } from '../../interfaces/message';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let threadServiceSpy: jasmine.SpyObj<QuestionThreadService>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['retrieveMessagesByQuestion', 'createMessage']);
    threadServiceSpy = jasmine.createSpyObj('QuestionThreadService', ['retrieveQuestionThreadById', 'getThreadTitle', 'updateQuestionThread', 'createQuestionThread']);
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['retrieveUserId', 'retrieveUserType']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['userWithId']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: QuestionThreadService, useValue: threadServiceSpy },
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    component['pollingSubscription'] = { unsubscribe: () => {} } as Subscription;

    authServiceSpy.retrieveUserId.and.returnValue('user1');
    authServiceSpy.retrieveUserType.and.returnValue(UserType.TEACHER);
  });

  it('should initialize new thread on empty ID', () => {
    component.questionThreadId = 'new';
    component.currentUserId = 'user1';
    component.assignmentId = 'a1';
    component.learningObjectId = 'l1';
    component.loadThread();
    expect(component.currentThread.id).toBe('');
    expect(component.currentThread.creatorId).toBe('user1');
    expect(component.currentThread.assignmentId).toBe('a1');
    expect(component.title).toBe('');
  });

  it('should retrieve existing thread and title', fakeAsync(() => {
    const thread = { id: 't1', creatorId: 'user1', assignmentId: 'a1', learningObjectId: 'l1', isClosed: false, visibility: VisibilityType.PRIVATE } as QuestionThread;
    threadServiceSpy.retrieveQuestionThreadById.and.returnValue(of(thread));
    threadServiceSpy.getThreadTitle.and.returnValue(of('Thread Title'));
    component.questionThreadId = 't1';
    component.loadThread();
    tick();
    expect(component.currentThread).toEqual(thread);
    expect(component.title).toBe('Thread Title');
  }));

  it('updateVisibility should call service and update model', () => {
    component.questionThreadId = 't1';
    component.currentThread = { id: 't1', visibility: VisibilityType.PRIVATE } as QuestionThread;
    const updateResult = { isClosed: false, visibility: VisibilityType.GROUP };
    threadServiceSpy.updateQuestionThread.and.returnValue(of(updateResult));
    component.updateVisibility(VisibilityType.GROUP);
    expect(threadServiceSpy.updateQuestionThread).toHaveBeenCalledWith(
      't1', jasmine.objectContaining({ visibility: VisibilityType.GROUP })
    );
    expect(component.currentThread.visibility).toBe(VisibilityType.GROUP);
  });

  it('navigateToAssignment should route based on userType', () => {
    component.currentThread = { assignmentId: 'a1' } as QuestionThread;
    authServiceSpy.retrieveUserType.and.returnValue(UserType.TEACHER);
    component.navigateToAssignment();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['teacher', 'assignments', 'a1']);
    authServiceSpy.retrieveUserType.and.returnValue(UserType.STUDENT);
    component.navigateToAssignment();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['student', 'assignments', 'a1']);
  });

  it('isUserMessage should identify own messages', () => {
    authServiceSpy.retrieveUserId.and.returnValue('user1');
    expect(component.isUserMessage({ senderId: 'user1' } as Message)).toBeTrue();
    expect(component.isUserMessage({ senderId: 'user2' } as Message)).toBeFalse();
  });

  it('loadMessages should empty messages for new thread', () => {
    component.questionThreadId = 'new';
    component.loadMessages();
    expect(component.messages).toEqual([]);
  });

  it('sendMessage should create new thread for new ID then send message', fakeAsync(() => {
    const newThread = { id: 't2' } as QuestionThread;
    threadServiceSpy.createQuestionThread.and.returnValue(of(newThread));
    messageServiceSpy.createMessage.and.returnValue(of('m1'));
    // Prevent polling to avoid fetchAndProcessMessages call
    spyOn(component as unknown as { startPolling: () => void }, 'startPolling');
    // Stub message retrieval to safe default
    messageServiceSpy.retrieveMessagesByQuestion?.and?.returnValue(of([]));

    component.questionThreadId = 'new';
    component.assignmentId = 'a1';
    component.learningObjectId = 'l1';
    component.newMessageContent = 'hello';
    spyOn(component, 'loadThread');
    component.sendMessage();
    tick();
    expect(threadServiceSpy.createQuestionThread).toHaveBeenCalled();
    expect(component.newMessageContent).toBe('');
    expect((component as unknown as { startPolling: () => void }).startPolling).toHaveBeenCalled();
  }));
});
