import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, HttpClientModule, MatIconModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.less'],
//   providers: [StudentDashboardService]
})
export class StudentDashboardComponent {

  id: string = "test";
  learningPathsLink: string = '/student/learning-paths';

  selectedView: string | null = null;

  setView(view: string) {
    this.selectedView = this.selectedView === view ? null : view;
  }
}