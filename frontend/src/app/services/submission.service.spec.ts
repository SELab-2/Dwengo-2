import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { SubmissionService } from './submission.service';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { NewSubmission } from '../interfaces/submissions/newSubmission';
import { NewSubmissionResponse } from '../interfaces/submissions/newSubmissionResponse';

describe('SubmissionService', () => {
  let service: SubmissionService;
  let httpMock: HttpTestingController;

  const mockAuthService = {
    retrieveAuthenticationHeaders: () => ({
      headers: { Authorization: 'Bearer fake-token' }
    })
  };

  const mockErrorService = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SubmissionService,
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: ErrorService, useValue: mockErrorService },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(SubmissionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request to create submission and return the ID', (done) => {
    const mockSubmission: NewSubmission = {
      studentId: 'student-001',
      assignmentId: 'assignment-abc',
      learningObjectId: 'lo-xyz',
      time: new Date('2025-05-13T10:00:00Z'),
      contents: 'Test submission contents',
    };

    const mockResponse: NewSubmissionResponse = {
      id: 'submission-123'
    };

    service.createSubmission(mockSubmission).subscribe((submissionId) => {
      expect(submissionId).toBe('submission-123');
      done();
    });

    const req = httpMock.expectOne(`${service['API_URL']}/submissions`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSubmission);
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(mockResponse);
  });
});
