import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatList } from '@angular/material/list'
import { AssignmentsService } from '../../services/assignments.service';
import { Assignment } from '../../interfaces/assignments/assignment';
import { MiniAssignmentComponent } from '../mini-assignment/mini-assignment.component';


@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule, MatList, MiniAssignmentComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.less'],
  // providers: [StudentDashboardService]
})
export class StudentDashboardComponent implements OnInit {
  private _assignments: Assignment[] = [];

  constructor(
      // private authService: AuthenticationService,
      // private errorService: ErrorService,
      private assignmentsService: AssignmentsService,
    ) {}
  
  ngOnInit() {
    // this.assignmentsService
    //   .assignmentsOfUser()
    //   .subscribe({
    //     next: (assignments) => this._assignments = assignments,
    //   });
    
    this._assignments = [ //TODO remove this test code
      {
        id: "Assignment1",
        classId: "class 1",
        learningPathId: "1",
        startDate: "2023-10-01",
        deadline: "2023-10-31",
        extraInstructions: "test123",
      },
      {
        id: "Trivia Quiz",
        classId: "class 2",
        learningPathId: "2",
        startDate: "2023-11-01",
        deadline: "2023-11-15",
        extraInstructions: "test456",
      }
    ]
  }

  
    public get assignments(): Assignment[] {
      return this._assignments;
    }
}