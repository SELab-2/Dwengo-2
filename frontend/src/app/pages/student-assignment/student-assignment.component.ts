import { Component, OnInit } from '@angular/core';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../../interfaces/assignment';


@Component({
  selector: 'app-student-assignment',
  imports: [],
  templateUrl: './student-assignment.component.html',
  styleUrl: './student-assignment.component.less'
})
export class StudentAssignmentComponent implements OnInit {
  private _assignments: Assignment[] = [];

  constructor(
    private readonly assignmentService: AssignmentService,
  ) {}

  ngOnInit() {
    this.fillAssignments();
  }

  /**
   * Fill in the assignments array with the assignments of the current user
   */
  fillAssignments() {
    this.assignmentService
      .retrieveAssignments()
      .subscribe({
        next: (assignments) => this.assignments = assignments,
      })
  }

  get assignments(): Assignment[] {
    return this._assignments;
  }

  set assignments(assignments: Assignment[]) {
    this._assignments = assignments;
  }
  
}
