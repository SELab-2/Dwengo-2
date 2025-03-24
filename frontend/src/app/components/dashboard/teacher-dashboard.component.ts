import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { TeacherDashboardService } from '../../services/getClasses.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, HttpClientModule, MatIconModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.less'],
  providers: [TeacherDashboardService]
})
export class TeacherDashboardComponent implements OnInit {
  id: string = "test";
  learningPathsLink: string = '/teacher/learning-paths';
  createClassLink: string = '/teacher/classes/new/select';

  selectedView: string | null = null;

  // This is all mock data, awaiting some API functionality after refactor
  classes = ["Class 1", "Class 2", "Class 3"];
  deadlines = ["Math Exam - 03/30", "History Essay - 04/02", "Science Report - 04/05"];
  questions = [
    { assignment: "Math Homework", question: "What is Pythagoras' theorem?" },
    { assignment: "Science Project", question: "How do you calculate force?" }
  ];

  constructor(private dashboardService: TeacherDashboardService) { }

  ngOnInit(): void { }

  setView(view: string) {
    this.selectedView = this.selectedView === view ? null : view;
  }
}
