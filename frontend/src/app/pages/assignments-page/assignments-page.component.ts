import { Component, OnInit } from '@angular/core';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';
import { Assignment } from '../../interfaces/assignment';
import { AssignmentService } from '../../services/assignment.service';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-assignments-page',
  imports: [AuthenticatedHeaderComponent, MatListModule],
  templateUrl: './assignments-page.component.html',
  styleUrl: './assignments-page.component.less'
})
export class AssignmentsPageComponent implements OnInit {
  private _assignments: Assignment[] = [];

  get assignments(): Assignment[] {
    return this._assignments;
  }

  set assignments(assignments: Assignment[]) {
    this._assignments = assignments;
  }

  constructor(
    private readonly assignmentsService: AssignmentService,
  ) {}

  ngOnInit(): void {
    this.assignmentsService.retrieveAssignments().subscribe({
      next: (assignments) => this.assignments = assignments,
    });
  }
  
}
