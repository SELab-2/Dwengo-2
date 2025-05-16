import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ProgressService } from './progress.service';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { Progress } from '../interfaces/progress/progress';
import { ClassActivity } from '../interfaces/progress/activity';
import { ClassCompletion } from '../interfaces/progress/completion';

describe('ProgressService', () => {
  let service: ProgressService;
  let httpMock: HttpTestingController;

  const mockAuthService = {
    retrieveAuthenticationHeaders: () => ({
      headers: { Authorization: 'Bearer fake-token' }
    })
  };
  let errorService: jasmine.SpyObj<ErrorService>;

  beforeEach(() => {
    errorService = jasmine.createSpyObj('ErrorService', ['pipeHandler', 'retrieveError', 'createError', 'deleteError', 'updateError']);
    errorService.pipeHandler.and.callFake(() => (source) => source);
    errorService.retrieveError.and.returnValue("retrieveError");
    errorService.createError.and.returnValue("createError");
    errorService.deleteError.and.returnValue("deleteError");
    errorService.updateError.and.returnValue("updateError");
    TestBed.configureTestingModule({
      providers: [
        ProgressService,
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: ErrorService, useValue: errorService },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProgressService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // check of er geen openstaande requests zijn
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch progress for given user and assignment', () => {
    const userId = '123';
    const assignmentId = '456';
    const mockProgress: Progress = {
        id: "1",
        studentId: "123",
        assignmentId: '456',
        learningObjectId: "789",
        step: 1,
        maxStep: 20,
        time: new Date().toDateString()
    };

    service.getUserAssignmentProgress(userId, assignmentId).subscribe((result) => {
      expect(result).toEqual(mockProgress);
    });

    const req = httpMock.expectOne(
      `${service['API_URL']}/users/123/assignments/456/progress`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(mockProgress);
  });

  it('should fetch class activity for given classId', () => {
  const classId = 'abc123';
  const mockActivity: ClassActivity = {
    activity: [5, 10, 15, 20]
  };

  service.getClassActivity(classId).subscribe((result) => {
    expect(result).toEqual(mockActivity);
  });

  const req = httpMock.expectOne(
    `${service['API_URL']}/classes/${classId}/activity`
  );
  expect(req.request.method).toBe('GET');
  expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

  req.flush(mockActivity);
});

it('should fetch class completion for given classId', () => {
  const classId = 'abc123';
  const mockCompletion: ClassCompletion = {
    percentage: 85
  };

  service.getClassCompletion(classId).subscribe((result) => {
    expect(result).toEqual(mockCompletion);
  });

  const req = httpMock.expectOne(
    `${service['API_URL']}/classes/${classId}/completion`
  );
  expect(req.request.method).toBe('GET');
  expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

  req.flush(mockCompletion);
});

});
