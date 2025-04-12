import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';
import { forkJoin, Observable, switchMap } from 'rxjs';
import { Assignment } from '../interfaces/assignment';
import { AssignmentResponse } from '../interfaces/assignment/assignmentResponse';

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
      this.errorService.pipeHandler(),
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
  
}
