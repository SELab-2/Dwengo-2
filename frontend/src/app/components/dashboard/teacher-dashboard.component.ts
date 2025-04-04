import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import {
  NgApexchartsModule,
  ChartComponent
} from "ng-apexcharts";
import { ClassChartComponent, ClassChartData } from '../small-components/graphs/class-graph/class-graph.component';
import { ActivityChartComponent, ActivityChartData } from '../small-components/graphs/activity-graph/activity-graph.component';
import { MenuCardComponent } from '../small-components/menu-card/menu-card.component';
import { ClassesService } from '../../services/classes.service';
import { AssignmentsService } from '../../services/assignments.service';
import { NewAssignment } from '../../interfaces/assignments/newAssignment';




@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, HttpClientModule, MatIconModule, NgApexchartsModule, ClassChartComponent, ActivityChartComponent, MenuCardComponent],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.less']
})
export class TeacherDashboardComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  id: string = "test";
  learningPathsLink: string = '/teacher/learning-paths';
  createClassLink: string = '/teacher/classes/new/select';

  selectedView: string | null = null;

  // This is all mock data, awaiting some API functionality after refactor
  classesTitle: string = $localize`:@@viewClasses:View Classes`;
  deadlinesTitle: string = $localize`:@@incomingDeadlines:Current Deadlines`;
  questionsTitle: string = $localize`:@@answerQuestions:Answer Questions`;
  notificationsTitle: string = $localize`:@@notifications:Notifications`;

  constructor(private classesService: ClassesService, private assignmentsService: AssignmentsService) { }

  private loadData(): void {
    this.classesService.classesOfUser().subscribe(classes => {
      this.classChartData = classes.map(c => new ClassChartData(c.name, /*TODO: progress*/2, /*TODO: finished students*/1));
      this.activityChartData = classes.map(c => new ActivityChartData(c.name, /*TODO: activity*/[4, 10, 41, 35, 51, 49, 62, 69, 73, 86]));
      console.log(this.classChartData, this.activityChartData);
    });
    this.assignmentsService.assignmentsOfUser().subscribe(assignments => {
      console.log(assignments);
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  makeAssignment = () => {
    this.assignmentsService.createAssignment({
      startDate: new Date(),
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      extraInstructions: "Please do this assignment"
    }).subscribe(response => 
      console.log(response));
  }

  classes = ["Class 1", "Class 2", "Class 3"];
  deadlines = ["Math Exam - Jan 17th", "History Essay - Feb 7th", "Science Report - May 26th"];
  questions = [
    { assignment: "Math Homework", question: "What is Pythagoras' theorem?" },
    { assignment: "Science Project", question: "How do you calculate force?" }
  ];
  notifications = [
    { name: "Dirk", data: "Wants to join 'Physics'" },
    { name: "Kevin", data: "Asked you a question" },
  ]
  public classChartData!: ClassChartData[];
  public activityChartData!: ActivityChartData[];

  setView(view: string) {
    this.selectedView = this.selectedView === view ? null : view;
  }
}
