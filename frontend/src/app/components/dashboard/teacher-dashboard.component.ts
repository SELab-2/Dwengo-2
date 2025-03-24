import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.less']
})
export class TeacherDashboardComponent {
  groupsProgress = [
    { group: 'Group A', progress: 75 },
    { group: 'Group B', progress: 50 },
    { group: 'Group C', progress: 90 },
  ];

  classes = ['Class 1', 'Class 2', 'Class 3'];
  assignments = ['Assignment 1', 'Assignment 2', 'Assignment 3'];

  learningPathsLink = '/teacher/learning-paths';
}
