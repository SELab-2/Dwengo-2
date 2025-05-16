import { Component, OnInit } from '@angular/core';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';
import { Assignment } from '../../interfaces/assignment';
import { AssignmentService } from '../../services/assignment.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MatListModule } from '@angular/material/list';
import { UserType } from '../../interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CreateAssignmentComponent } from '../../components/create-assignment/create-assignment.component';
import { RouterLink } from '@angular/router';

type AssignmentDateFilter = (assignment: Assignment) => boolean;

@Component({
  selector: 'app-assignments-page',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-VS' }
  ],
  imports: [
    AuthenticatedHeaderComponent,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CreateAssignmentComponent,
    RouterLink
  ],
  templateUrl: './assignments-page.component.html',
  styleUrl: './assignments-page.component.less'
})
export class AssignmentsPageComponent implements OnInit {

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly assignmentsService: AssignmentService,
  ) { }

  ngOnInit(): void {
    this.assignmentsService.retrieveAssignments().subscribe({
      next: (assignments) => {
        this.assignments = assignments;
      },
    });
  }

  /**
   * The assignments of the currently logged in user
   */

  private _assignments: Assignment[] = [];

  get assignments(): Assignment[] {
    return this._assignments;
  }

  get filteredAssignments(): Assignment[] {
    return this._assignments.filter(this.filter);
  }

  set assignments(assignments: Assignment[]) {
    this._assignments = assignments;
  }

  get isTeacher(): boolean {
    return this.authenticationService.retrieveUserType() === UserType.TEACHER;
  }

  /**
   * Filter function to filter assignments by date
   */

  private filter: AssignmentDateFilter = () => true;

  filterByDeadline(deadline: Date): void {
    this.filter = (assignment: Assignment) => {
      return assignment.deadline < deadline;
    };
  }

  /**
   * Show or hide the create assignment component
   */

  showCreate: boolean = false;

}