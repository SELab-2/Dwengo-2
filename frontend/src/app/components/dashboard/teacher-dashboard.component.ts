import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { TeacherDashboardService } from '../../services/getClasses.service';
import {
  NgApexchartsModule,
  ChartComponent
} from "ng-apexcharts";
import { ClassChartComponent, ClassChartData } from '../graphs/class-graph/class-graph.component';
import { ActivityChartComponent, ActivityChartData } from '../graphs/activity-graph/activity-graph.component';
import { MenuCardComponent } from '../small-components/menu-card/menu-card.component';




@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, HttpClientModule, MatIconModule, NgApexchartsModule, ClassChartComponent, ActivityChartComponent, MenuCardComponent],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.less'],
  providers: [TeacherDashboardService]
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


  classes = ["Class 1", "Class 2", "Class 3"];
  deadlines = ["Math Exam - Jan 17th", "History Essay - Feb 7th", "Science Report - May 26th"];
  questions = [
    { assignment: "Math Homework", question: "What is Pythagoras' theorem?" },
    { assignment: "Science Project", question: "How do you calculate force?" }
  ];
  public classChartData!: ClassChartData[];
  public activityChartData!: ActivityChartData[];

  constructor(private dashboardService: TeacherDashboardService) {
  }

  ngOnInit(): void {
    // verander zodat je api callt
    this.classChartData = [
      new ClassChartData("Maths", 76, 44),
      new ClassChartData("Physics", 82, 47),
      new ClassChartData("Biology", 99, 59),
      new ClassChartData("STEM", 72, 34),
      new ClassChartData("Literature", 79, 39),
    ]
    //new ClassChartData([40, 36, 57, 82, 65], [13, 15, 10, 43, 61]);
    this.activityChartData = [
      new ActivityChartData("Maths", [4, 10, 41, 35, 51, 49, 62, 69, 73, 86]),
      new ActivityChartData("Physics", [5, 8, 12, 16, 28, 35, 43, 48, 54]),
      new ActivityChartData("STEM", [3, 5, 7, 10, 15, 35, 42, 51, 58, 64, 72, 81, 95])
    ]
  }


  setView(view: string) {
    this.selectedView = this.selectedView === view ? null : view;
  }
}
