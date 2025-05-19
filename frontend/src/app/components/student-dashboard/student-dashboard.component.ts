import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../../interfaces/assignment/assignment';
import { ClassesService } from '../../services/classes.service';
import { Class } from '../../interfaces/classes/class';
import { MiniAssignmentComponent } from '../mini-assignment/mini-assignment.component';
import { PaginatedGridComponent } from '../paginated-grid/paginated-grid.component';
import { MiniClassComponent } from '../mini-class/mini-class.component';
import { RouterLink } from '@angular/router';
import { Group } from '../../interfaces/group/group';
import { GroupService } from '../../services/group.service';
import { AuthenticationService } from '../../services/authentication.service';
import { CardSkeletonLoaderComponent } from '../small-components/card-skeleton-loader/card-skeleton-loader.component';
import { Progress } from '../../interfaces/progress/progress';
import { ProgressService } from '../../services/progress.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatIconModule,
    MiniAssignmentComponent,
    MiniClassComponent,
    MatPaginatorModule,
    MatButtonModule,
    PaginatedGridComponent,
    CardSkeletonLoaderComponent
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.less'],
})
export class StudentDashboardComponent implements OnInit {
  private _assignments: Assignment[] = [];
  private _classes: Class[] = [];
  private _groups: Group[] = [];
  private _assignmentToProgress: Record<string, Progress> = {};
  private _assignmentToGroup: Record<string,Group> = {};

  public pagedAssignments: Assignment[] = [];
  // Array with useless info to render skeleton loaders 
  public LOADINGDATA: {id: number}[] = Array(6).fill(0).map((v, i) => ({id: i}))
  public loadingProgress: boolean = true; 
  public loadingGroups: boolean = true; 
  public loadingClasses: boolean = true;

  pageSize = 12;
  currentPageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private classesService: ClassesService,
    private assignmentService: AssignmentService,
    private groupService: GroupService,
    private authService: AuthenticationService,
    private progressService: ProgressService
  ) {}

  ngOnInit() {
    const storedPageSize = localStorage.getItem('dashboardPageSize');
    const storedPageIndex = localStorage.getItem('dashboardPageIndex');
    if (storedPageSize) this.pageSize = parseInt(storedPageSize);
    if (storedPageIndex) this.currentPageIndex = parseInt(storedPageIndex);

    this.classesService.classesOfUser().subscribe({
      next: (classes: Class[]) => {
        this.loadingClasses = false;
        this._classes = classes;
      }
      
    });

    this.assignmentService.retrieveAssignments().subscribe({
      next: (assignments: Assignment[]) => {
        // Remove assignments where deadline is in past
        this._assignments = assignments.filter(a => {
            return new Date(a.deadline) >= new Date()
        });
        this._assignments.forEach((assignment) => {
          const classId = assignment.classId;
          const className = this.classesService.classWithId(classId);
          className.subscribe(cls => {
            assignment.className = cls?.name || 'Unknown Class';
          });
        });
        this.updatePagedAssignments();
        if(userId) {
          const progressObservables = this.assignments.map(a =>
            this.progressService.getUserAssignmentProgress(userId, a.id)
          );
          forkJoin(progressObservables).subscribe({
            next: (results: Progress[]) => {
              results.forEach((progress, index) => {
                this._assignmentToProgress[this.assignments[index].id] = progress;
              });
              this.loadingProgress = false;
            }
          });
          this.groupService.getAllGroupsFromUser(userId)
            .subscribe(response => {
              response.forEach(g => {
                this._assignmentToGroup[g.assignment.id] = g
              })
              this.loadingGroups = false;
            });
        }
      }
    });

    const userId: string | null = this.authService.retrieveUserId();
  }

  public get assignments(): Assignment[] {
    return this._assignments;
  }

  public get assignmentsWithGroup(): {assignment: Assignment, group: Group, id: string}[] {
    const now = new Date();

    const combined = this.assignments.map((assignment) => {
      const progress = this._assignmentToProgress[assignment.id];
      const group = this._assignmentToGroup[assignment.id];
      return { assignment, group, progress, id: assignment.id };
    });

    // Predicate to check if assignment is finished
    const isFinished = (progress: Progress) =>
      progress && progress.step >= progress.maxStep;

    const parseDate = (date: string | Date) => new Date(date).getTime();

    // Sort finished assignments according to first upcoming deadline
    const finished = combined
      .filter(item => isFinished(item.progress))
      .sort((a, b) => parseDate(a.assignment.deadline) - parseDate(b.assignment.deadline));
    
    const notFinished = combined
    .filter(item => !isFinished(item.progress))
    .sort((a, b) => {
      const aStart = parseDate(a.assignment.startDate);
      const bStart = parseDate(b.assignment.startDate);
      const aDeadline = parseDate(a.assignment.deadline);
      const bDeadline = parseDate(b.assignment.deadline);

      const aStarted = aStart <= now.getTime();
      const bStarted = bStart <= now.getTime();

      // Started first > not started
      if (aStarted && !bStarted) return -1;
      if (!aStarted && bStarted) return 1;

      // Same status: sort on deadline
      return aDeadline - bDeadline;
    });
    return [...notFinished, ...finished];
  }

  public get classes(): Class[] {
    return this._classes;
  }

  public get totalAssignments(): number {
    return this._assignments.length;
  }

  public onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPageIndex = event.pageIndex;
    localStorage.setItem('dashboardPageSize', event.pageSize.toString());
    localStorage.setItem('dashboardPageIndex', event.pageIndex.toString());
    this.updatePagedAssignments();
  }

  public updatePagedAssignments(): void {
    const start = this.currentPageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedAssignments = this._assignments.slice(start, end);
  }
}
