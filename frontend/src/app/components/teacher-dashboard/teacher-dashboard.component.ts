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
import { AssignmentService } from '../../services/assignment.service';
import { Class } from '../../interfaces/classes/class';
import { MockServices } from './mock-services';
import { ClassOverviewWidgetComponent } from '../small-components/class-overview-widget/class-overview-widget.component';
import { DeadlinesWidgetComponent } from '../small-components/upcoming-deadlines-widget/deadlines-widget.component';
import { Assignment } from '../../interfaces/assignment';
import { catchError, defaultIfEmpty, forkJoin, map, of, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { ProgressService } from '../../services/progress.service';
import { UsersOfClass } from '../../interfaces/user/usersOfClass';
import { CardSkeletonLoaderComponent } from '../small-components/card-skeleton-loader/card-skeleton-loader.component';
import { ClassActivity, ClassCompletion, ClassScore } from '../../interfaces/progress';




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
    MatButtonModule,
    CardSkeletonLoaderComponent
  ],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.less']
})
export class TeacherDashboardComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  id: string = "test";
  learningPathsLink: string = '/explore';
  createClassLink: string = '/teacher/classes/';

  selectedView: string | null = "classes";
  loadingData: boolean = true;
  loadingClasses: boolean = true;
  displayClassChart: boolean = false;
  displayActivityChart: boolean = false;
  classes: Class[] = [];
  assignments: Assignment[] = [];

  // This is all mock data, awaiting some API functionality after refactor
  classesTitle: string = $localize`:@@viewClasses:View Classes`;
  deadlinesTitle: string = $localize`:@@incomingDeadlines:Upcoming Deadlines`;
  questionsTitle: string = $localize`:@@answerQuestions:Answer Questions`;

  constructor(
    private classesService: ClassesService,
    private assignmentsService: AssignmentService,
    private progressService: ProgressService
  ) { }

  private retrieveData(): void {
    forkJoin({
      classes: this.classesService.classesOfUser().pipe(
        catchError(() => of([])),
        defaultIfEmpty([])
      ),
      assignments: this.assignmentsService.retrieveAssignments().pipe(
        catchError(() => of([])),
        defaultIfEmpty([])
      ),
    }).pipe(
      // Combine both requests
      switchMap(({ classes, assignments }) => {
        // Classes and assignments are fetched update them
        this.classes = classes;
        // Collect all the assignments of the class
        const localizedAssignments: Assignment[] = [];
        classes.forEach(cls => localizedAssignments.push(
          ...assignments
            .filter(a => a.classId === cls.id)
            .map(a => ({
              ...a,
              name: a.name ?? $localize`:@@unnamed:Unnamed`,
              deadline: a.deadline ?? $localize`:@@noDeadline:No deadline found`,
              className: cls.name ?? $localize`:@@unnamed:Unnamed`,
            }))
        ));
        this.assignments = localizedAssignments
        this.loadingClasses = false;
        // Still need to put the amount of students + completion and activity
        const enrichedClasses = classes.map(cls => {
          return forkJoin({
            users: this.classesService.usersInClass(cls.id).pipe(
              catchError(() => of({ students: [], teachers: [] } as UsersOfClass)),
              defaultIfEmpty({ students: [], teachers: [] } as UsersOfClass)
            ),
            classActivity: this.progressService.getClassActivity(cls.id).pipe(
              catchError(() => of({ activity: [] } as ClassActivity)),
              defaultIfEmpty({ activity: [] } as ClassActivity)
            ),
            classCompletion: this.progressService.getClassCompletion(cls.id).pipe(
              catchError(() => of({ percentage: 0 } as ClassCompletion)), // Default percentage to zero
              defaultIfEmpty({ percentage: 0 } as ClassCompletion)
            ),
            classScore: this.progressService.getClassScore(cls.id).pipe(
              catchError(() => of({ score: 0 } as ClassScore)), // Default percentage to zero
              defaultIfEmpty({ score: 0 } as ClassScore)
            )
            // classScore: this.progressService
          }).pipe(
            // Map the pipe-response, add studentcount and assignment
            map(({ users, classActivity, classCompletion, classScore }) => {
              return {
                ...cls,
                studentCount: users.students.length,
                assignments: this.assignments.filter(a => a.classId === cls.id),
                submissionActivity: classActivity.activity,
                completionPercentage: classCompletion.percentage,
                averageScore: classScore.score
              };
            })
          )
        });

        // After every call is done, return these classes
        return forkJoin(enrichedClasses);
      })
    ).subscribe(enrichedClasses => {
      // Update the classes with the extra data
      this.classes = enrichedClasses;
      // With this data we can display analytics (if possible)
      this.fillCharts();
    }).add(() => {
      this.loadingData = false
    });
  }

  // This function serves as a mock data provider to showcase the charts and widgets
  private retrieveMockData(): void {
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
    this.classChartData = this.classes.filter((c: Class) => c.averageScore).map(c => new ClassGraphComponent(c.name, c.averageScore!));
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
