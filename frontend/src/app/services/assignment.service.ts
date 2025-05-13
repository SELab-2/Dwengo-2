import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { Assignment, NewAssignment } from '../interfaces/assignment';
import { AssignmentResponse, AssignmentResponseSingle } from '../interfaces/assignment/assignmentResponse';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  private API_URL = environment.API_URL;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private errorService: ErrorService,
  ) {}

  /**
   * Retrieve the assignments of the currently logged in user
   * @returns An observable of the assignments of the currently logged in user
   */
  retrieveAssignments(): Observable<Assignment[]> {
    const userId = this.authenticationService.retrieveUserId();
    const headers = this.authenticationService.retrieveAuthenticationHeaders();

    return this.http.get<AssignmentResponse>(
      `${this.API_URL}/users/${userId}/assignments`,
      headers
    ).pipe(
      this.errorService.pipeHandler(
        this.errorService.retrieveError($localize `:@@assignmentsServicesTestAssignments:assignments`)
      ),
      switchMap(response => 
        forkJoin(
          response.assignments.map(id => 
            this.http.get<Assignment>(
              `${this.API_URL}/assignments/${id}`,
              headers
            )
          )
        )
      )
    );
  }

  /**
   * Retrieve a single assignment by its ID
   */
  retrieveAssignmentById(id: string): Observable<Assignment> {
    const headers = this.authenticationService.retrieveAuthenticationHeaders();

    return this.http.get<Assignment>(
      `${this.API_URL}/assignments/${id}`,
      headers
    ).pipe(
      this.errorService.pipeHandler(
        this.errorService.retrieveError($localize `:@@assignmentsServicesTestAssignments:assignment`)
      )
    ); 
  }
  
  /**
   * Create a new assignment
   * @param assignment The assignment to create
   * @returns An observable of the created assignment
   */
  createAssignment(assignment: NewAssignment): Observable<Assignment> {
    const headers = this.authenticationService.retrieveAuthenticationHeaders();

    return this.http.post<AssignmentResponseSingle>(
      `${this.API_URL}/assignments`,
      assignment,
      headers
    ).pipe(
      this.errorService.pipeHandler(
        this.errorService.createError($localize `:@@assignmentsServicesTestAssignments:assignment`)
      ),
      switchMap(response => of({
          ...assignment,
          id: response.id
        })
      )
    );
  }

  /**
   * Update an assignment
   * @param assignment The assignment to update
   * @returns An observable of the updated assignment
   */
  updateAssignment(assignment: Assignment): Observable<Assignment> {
    const headers = this.authenticationService.retrieveAuthenticationHeaders();

    return this.http.patch<void>(
      `${this.API_URL}/assignments/${assignment.id}`,
      assignment,
      headers
    ).pipe(
      this.errorService.pipeHandler(
        this.errorService.updateError($localize `:@@assignmentsServicesTestAssignments:assignment`)
      ),
      switchMap(() => of(assignment)) // return the updated assignment
    );
  }

  /**
   * Delete an assignment
   * @param assignment The assignment to delete
   * @returns An observable that is true if the assignment was deleted
   */
  deleteAssignment(assignment: Assignment): Observable<boolean> {
    const headers = this.authenticationService.retrieveAuthenticationHeaders();

    return this.http.delete<void>(
      `${this.API_URL}/assignments/${assignment.id}`,
      headers
    ).pipe(
      this.errorService.pipeHandler(
        this.errorService.deleteError($localize `:@@assignmentsServicesTestAssignments:assignment`)
      ),
      switchMap(() => of(true)) // return true if the assignment was deleted
    );
  }
}
