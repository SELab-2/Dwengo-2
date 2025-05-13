import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ProgressService } from './progress.service';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { Progress } from '../interfaces/progress/Progress';

describe('ProgressService', () => {
  let service: ProgressService;
  let httpMock: HttpTestingController;

  const mockAuthService = {
    retrieveAuthenticationHeaders: () => ({
      headers: { Authorization: 'Bearer fake-token' }
    })
  };

  const mockErrorService = {
    pipeHandler: () => (source: any) => source // doe niks met errors voor nu
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgressService,
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: ErrorService, useValue: mockErrorService },
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
});
