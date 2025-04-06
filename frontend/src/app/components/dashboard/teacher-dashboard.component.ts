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
import { Class } from '../../interfaces/classes/class';
import { MockServices } from './mock-services';
import { Assignment } from '../../interfaces/assignments/assignment';
import { ClassOverviewWidgetComponent } from '../small-components/class-overview-widget/class-overview-widget.component';
import { DeadlinesWidgetComponent } from '../small-components/upcoming-deadlines-widget/upcoming-deadline-widget.component';




@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, HttpClientModule, MatIconModule, NgApexchartsModule, ClassChartComponent, ActivityChartComponent, MenuCardComponent, ClassOverviewWidgetComponent, DeadlinesWidgetComponent],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.less']
})
export class TeacherDashboardComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  id: string = "test";
  learningPathsLink: string = '/teacher/learning-paths';
  createClassLink: string = '/teacher/classes/new/select';

  selectedView: string | null = "classes";
  classes!: Class[];
  assignments!: { deadline: Date, name: string, id: string, className: string }[];

  // This is all mock data, awaiting some API functionality after refactor
  classesTitle: string = $localize`:@@viewClasses:View Classes`;
  deadlinesTitle: string = $localize`:@@incomingDeadlines:Current Deadlines`;
  questionsTitle: string = $localize`:@@answerQuestions:Answer Questions`;

  constructor(private classesService: ClassesService, private assignmentsService: AssignmentsService) { }

  private retrieveData(): void {
    // TODO: use services
    this.classes = MockServices.getData()
    this.assignments = this.classes.map(c => {
      if (c.assignments) return c.assignments.map(a => {
        return {
          name: a.name!,
          deadline: a.deadline,
          className: c.name,
          id: a.id,
        };
      });
      return [];
    }).flat();
    this.classChartData = this.classes.map(c => new ClassChartData(c.name, c.averageScore!));
    this.activityChartData = this.classes.map(c => new ActivityChartData(c.name, c.submissionActivity!));
  }

  ngOnInit(): void {
    this.retrieveData();
  }

  public classChartData!: ClassChartData[];
  public activityChartData!: ActivityChartData[];

  setView(view: string) {
    this.selectedView = view;
  }
}
