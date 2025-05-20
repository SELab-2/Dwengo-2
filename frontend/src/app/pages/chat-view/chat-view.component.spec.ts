import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ChatViewComponent } from './chat-view.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { QuestionThreadService } from '../../services/questionThread.service';
import { AuthenticationService } from '../../services/authentication.service';
import { UserType } from '../../interfaces';
import { Router } from '@angular/router';
import { Component, Input } from '@angular/core';
import { QuestionThread, VisibilityType } from '../../interfaces/questionThread/questionThread';

@Component({ selector: 'app-chat', template: '' })
class MockChatComponent { @Input() questionThreadId!: string; }

describe('ChatViewComponent', () => {
  let component: ChatViewComponent;
  let fixture: ComponentFixture<ChatViewComponent>;

  let routeParamSubject: Subject<ParamMap>;
  let threadServiceSpy: jasmine.SpyObj<QuestionThreadService>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let threadUpdateSubject: Subject<{ id: string; update: Partial<QuestionThread> }>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routeParamSubject = new Subject<ParamMap>();
    threadUpdateSubject = new Subject<{ id: string; update: Partial<QuestionThread> }>();

    threadServiceSpy = jasmine.createSpyObj('QuestionThreadService', ['loadSideBarQuestionThreads']);
    Object.defineProperty(threadServiceSpy, 'threadUpdate$', { get: () => threadUpdateSubject.asObservable() });
    threadServiceSpy.loadSideBarQuestionThreads.and.returnValue(of([]));

    authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['retrieveUserType']);
    authServiceSpy.retrieveUserType.and.returnValue(UserType.STUDENT);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ChatViewComponent, MockChatComponent],
      providers: [
        { provide: QuestionThreadService, useValue: threadServiceSpy },
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: { paramMap: routeParamSubject.asObservable() } },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatViewComponent);
    component = fixture.componentInstance;
  });

  it('should set userType and OTHER_CHATS on init for student', () => {
    spyOn(component, 'loadChats');
    component.ngOnInit();
    expect(authServiceSpy.retrieveUserType).toHaveBeenCalled();
    expect(component.userType).toBe('student');
    expect(component.OTHER_CHATS).toBe(component.GROUP_CHATS);
  });

  it('loadChats success should populate questionThreads and validChatId false', fakeAsync(() => {
    const threads: QuestionThread[] = [{ id: '1', assignmentId: 'a1', visibility: VisibilityType.PRIVATE, creatorId: '', learningObjectId: '', isClosed: false }];
    threadServiceSpy.loadSideBarQuestionThreads.and.returnValue(of(threads));
    component.currentAssignmentId = null;
    component.showOtherChats = false;
    component.loadChats();
    tick();
    expect(component.questionThreads).toEqual(threads);
    expect(component.validChatId).toBeFalse();
  }));

  it('loadChats error should clear questionThreads and validChatId false', fakeAsync(() => {
    threadServiceSpy.loadSideBarQuestionThreads.and.returnValue(throwError(() => new Error('Load error')));
    component.loadChats();
    tick();
    expect(component.questionThreads).toEqual([]);
    expect(component.validChatId).toBeFalse();
  }));

  it('should respond to route param changes', fakeAsync(() => {
    const threads: QuestionThread[] = [{ id: '1', assignmentId: 'a1', visibility: VisibilityType.PRIVATE, creatorId: '', learningObjectId: '', isClosed: false }];
    threadServiceSpy.loadSideBarQuestionThreads.and.returnValue(of(threads));
    component.ngOnInit();
    tick();

    const fakeParamMap = new Map<string, string>();
    fakeParamMap.set('id', '1');
    routeParamSubject.next({
      get: (key: string) => fakeParamMap.get(key),
      has: (key: string) => fakeParamMap.has(key),
    } as unknown as ParamMap);
    tick();

    expect(component.currentSelectedChatId).toBe('1');
    expect(component.validChatId).toBeTrue();
    expect(component.currentAssignmentId).toBe('a1');
  }));

  it('toggleChatVisibility should flip flag and reload chats', () => {
    threadServiceSpy.loadSideBarQuestionThreads.and.returnValue(of([]));
    component.showOtherChats = false;
    component.currentAssignmentId = null;
    component.toggleChatVisibility();
    expect(component.showOtherChats).toBeTrue();
    expect(threadServiceSpy.loadSideBarQuestionThreads).toHaveBeenCalledWith('', true);
  });

  it('handleChatItemClick in compact mode should update selection without navigation', fakeAsync(() => {
    component.compact = true;
    component.questionThreads = [{
      id: '2', assignmentId: 'a2', visibility: VisibilityType.PRIVATE, creatorId: '', learningObjectId: '', isClosed: false
    }];
    component.currentSelectedChatId = '';
    component.handleChatItemClick('2');
    expect(component.currentSelectedChatId).toBe('2');
    expect(component.validChatId).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));

  it('handleChatItemClick in full mode should navigate', () => {
    component.compact = false;
    component.userType = 'teacher';
    component.handleChatItemClick('3');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/', 'teacher', 'chat', '3']);
  });

  it('should update thread on threadUpdate$', () => {
    const threads: QuestionThread[] = [{
      id: '1', assignmentId: 'a1', visibility: VisibilityType.PRIVATE, creatorId: '', learningObjectId: '', isClosed: false
    }];
    component.questionThreads = threads;
    spyOn(component, 'loadChats');
    component.ngOnInit();
    threadUpdateSubject.next({ id: '1', update: { visibility: VisibilityType.GROUP } });
    expect(component.questionThreads[0].visibility).toBe(VisibilityType.GROUP);
  });
});
