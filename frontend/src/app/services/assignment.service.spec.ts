import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AssignmentService } from './assignment.service';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { Assignment, NewAssignment } from '../interfaces/assignment';
import { AssignmentResponse, AssignmentResponseSingle } from '../interfaces/assignment/assignmentResponse';
import { of, Observable } from 'rxjs';

describe('AssignmentService', () => {
  const thisAssignment: Assignment = {
    id: "assignment-id",
    classId: "class-id",
    startDate: new Date(2001, 9, 11),
    deadline: new Date(2025, 3, 14),
    extraInstructions: "extra instructions",
    learningPathId: "learning-path-id",
  };

  const newThisAssignment: NewAssignment = {
    classId: "class-id",
    startDate: new Date(2001, 9, 11),
    deadline: new Date(2025, 3, 14),
    extraInstructions: "extra instructions",
    learningPathId: "learning-path-id",
  };

  const otherAssignment: Assignment = {
    id: "other-assignment-id",
    classId: "class-id",
    startDate: new Date(2001, 9, 11),
    deadline: new Date(2025, 3, 14),
    learningPathId: "learning-path-id",
    extraInstructions: "extra instructions",
  };

  const assignmentResponseSingle: AssignmentResponseSingle = {
    id: thisAssignment.id
  };

  const assignmentResponse: AssignmentResponse = {
    assignments: [thisAssignment.id, otherAssignment.id]
  };

  let http: jasmine.SpyObj<HttpClient>;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;
  let errorService: jasmine.SpyObj<ErrorService>;

  let service: AssignmentService;

  beforeEach(() => {
    http = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete', 'patch']);

    errorService = jasmine.createSpyObj('ErrorService', ['pipeHandler', 'retrieveError', 'createError', 'deleteError', 'updateError']);
    errorService.pipeHandler.and.callFake(() => (source) => source);
    errorService.retrieveError.and.returnValue("retrieveError");
    errorService.createError.and.returnValue("createError");
    errorService.deleteError.and.returnValue("deleteError");
    errorService.updateError.and.returnValue("updateError");

    authenticationService = jasmine.createSpyObj('AuthenticationService', ['retrieveUserId', 'retrieveAuthenticationHeaders', 'retrieveToken']);

    authenticationService.retrieveUserId.and.returnValue("user-id");
    authenticationService.retrieveToken.and.returnValue("token");

    authenticationService.retrieveAuthenticationHeaders.and.returnValue({
      headers: new HttpHeaders().append('Authorization', `Bearer token`).append('Content-Type', 'application/json'),
    });

    service = new AssignmentService(http, authenticationService, errorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should respond with assignments', () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    http.get.and.callFake((url: string): Observable<any> => {
      if (url.includes(`assignments/${thisAssignment.id}`)) {
        return of(thisAssignment);
      } else if (url.includes(`assignments/${otherAssignment.id}`)) {
        return of(otherAssignment);
      } else if (url.includes('/assignments')) {
        return of(assignmentResponse);
      }

      return of(null);
    });

    service.retrieveAssignments().subscribe(assignments => {
      expect(assignments).toEqual([thisAssignment, otherAssignment]);
    });
  });

  it('should respond with a single assignment', () => {
    http.get.and.returnValue(of(thisAssignment));
    service.retrieveAssignmentById(thisAssignment.id).subscribe(assignment => {
      expect(assignment).toEqual(thisAssignment);
    });
  });

  it('should create an assignment', () => {
    http.post.and.returnValue(of(assignmentResponseSingle));
    service.createAssignment(newThisAssignment).subscribe(assignment => {
      expect(assignment).toEqual(thisAssignment);
    });
  });

  it('should update an assignment', () => {
    http.patch.and.returnValue(of(thisAssignment));
    service.updateAssignment(thisAssignment).subscribe(assignment => {
      expect(assignment).toEqual(thisAssignment);
    });
  });

  it('should delete an assignment', () => {
    http.delete.and.returnValue(of({}));
    service.deleteAssignment(thisAssignment).subscribe(response => {
      expect(response).toBeTrue();
    });
  });

});
