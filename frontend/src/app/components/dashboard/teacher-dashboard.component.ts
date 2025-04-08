import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import {
  NgApexchartsModule,
  ChartComponent
} from "ng-apexcharts";
import { ClassChartComponent, ClassGraphComponent } from '../small-components/graphs/class-graph/class-graph.component';
import { ActivityChartComponent, ActivityChartData } from '../small-components/graphs/activity-graph/activity-graph.component';
import { MenuCardComponent } from '../small-components/menu-card/menu-card.component';
import { ClassesService } from '../../services/classes.service';
import { AssignmentsService } from '../../services/assignments.service';
import { Class } from '../../interfaces/classes/class';
import { MockServices } from './mock-services';
import { ClassOverviewWidgetComponent } from '../small-components/class-overview-widget/class-overview-widget.component';
import { DeadlinesWidgetComponent } from '../small-components/upcoming-deadlines-widget/deadlines-widget.component';
import { Assignment } from '../../interfaces/assignments/assignment';
import { catchError, defaultIfEmpty, forkJoin, of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';




@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [RouterLink,
    CommonModule,
    HttpClientModule,
    MatIconModule,
    NgApexchartsModule,
    ClassChartComponent,
    ActivityChartComponent,
    MenuCardComponent,
    ClassOverviewWidgetComponent,
    DeadlinesWidgetComponent,
    MatButtonModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.less']
})
export class TeacherDashboardComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  id: string = "test";
  learningPathsLink: string = '/teacher/learning-paths';
  createClassLink: string = '/teacher/classes/new/select';

  selectedView: string | null = "classes";
  displayClassChart: boolean = false;
  displayActivityChart: boolean = false;
  classes: Class[] = [];
  assignments: Assignment[] = [];

  // This is all mock data, awaiting some API functionality after refactor
  classesTitle: string = $localize`:@@viewClasses:View Classes`;
  deadlinesTitle: string = $localize`:@@incomingDeadlines:Current Deadlines`;
  questionsTitle: string = $localize`:@@answerQuestions:Answer Questions`;

  constructor(private classesService: ClassesService, private assignmentsService: AssignmentsService) { }

  private retrieveData(): void {
    forkJoin({
      classes: this.classesService.classesOfUser().pipe(
        catchError(() => of([])), // Empty array when error occured
        defaultIfEmpty([]) // Also empty error when there's no reaction
      ),
      assignments: this.assignmentsService.assignmentsOfUser().pipe(
        catchError(() => of([])),
        defaultIfEmpty([])
      )
    }).subscribe(({ classes, assignments }) => {
      this.classes = classes.map(cls => ({
        ...cls,
        assignments: assignments
          .filter(a => a.classId === cls.id)
          .map(a => ({
            ...a,
            name: a.name ?? $localize`:@@unnamed:Unnamed`,
            deadline: a.deadline ?? $localize`:@@noDeadline:No deadline found`,
            className: cls.name ?? $localize`:@@unnamed:Unnamed`,
          }))
      }));
      // Assignment array is needed in components like "upcoming-deadlines-widget"
      this.assignments = this.classes.map(cls => cls.assignments!).flat();

      // Use this data to fill the charts
      this.fillCharts();
    });
  }

  private retrieveMockData(): void {
    // TODO: use services
    this.classes = MockServices.getClasses();
    const receivedAssignments = MockServices.getAssignments();

    // Make one object where every class has its Assignment objects.
    this.classes = this.classes.map(cls => ({
      ...cls,
      assignments: receivedAssignments.filter(assignment => assignment.classId === cls.id).map(a => {
        return {
          ...a,
          name: a.name ?? $localize`:@@unnamed:Unnamed`,
          deadline: a.deadline ?? $localize`:@@noDeadline:No deadline found`,
          className: cls.name ?? $localize`:@@unnamed:Unnamed`,
          id: a.id,
        } as Assignment;
      })
    }));

    // Assignment array is needed in components like "upcoming-deadlines-widget"
    this.assignments = this.classes.map(cls => cls.assignments!).flat();

    // Use this data to fill the charts
    this.fillCharts();
  }

  fillCharts(): void {
    this.classChartData = this.classes.filter(c => c.averageScore).map(c => new ClassGraphComponent(c.name, c.averageScore!));
    this.activityChartData = this.classes.filter(c => c.submissionActivity).map(c => new ActivityChartData(c.name, c.submissionActivity!));
    if (this.classChartData.length > 0) this.displayClassChart = true;
    if (this.activityChartData.length > 0) this.displayActivityChart = true;
  }

  ngOnInit(): void {
    this.retrieveData();
  }

  public classChartData: ClassGraphComponent[] = [];
  public activityChartData: ActivityChartData[] = [];

  setView(view: string) {
    this.selectedView = view;
  }

}
