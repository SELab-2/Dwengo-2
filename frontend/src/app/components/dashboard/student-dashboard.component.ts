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
})
export class StudentDashboardComponent implements OnInit {
  private _assignments: Assignment[] = [];

  constructor(
      private assignmentsService: AssignmentsService,
    ) {}
  
  ngOnInit() {
    this.assignmentsService
      .assignmentsOfUser()
      .subscribe({
        next: (assignments: Assignment[]) => this._assignments = assignments,
      });
  }

  
    public get assignments(): Assignment[] {
      return this._assignments;
    }
}