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
import { GroupCardComponent } from '../group-card/group-card.component';
import { GroupFilledIn } from '../../interfaces/group/groupFilledIn';
import { GroupService } from '../../services/group.service';
import { AuthenticationService } from '../../services/authentication.service';


@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatIconModule,
    MiniAssignmentComponent,
    MiniClassComponent,
    GroupCardComponent,
    MatPaginatorModule,
    MatButtonModule,
    PaginatedGridComponent,
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.less'],
})
export class StudentDashboardComponent implements OnInit {
  private _assignments: Assignment[] = [];
  private _classes: Class[] = [];
  private _groups: GroupFilledIn[] = [];

  public pagedAssignments: Assignment[] = [];

  pageSize = 12;
  currentPageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private classesService: ClassesService,
    private assignmentService: AssignmentService,
    private groupService: GroupService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    const storedPageSize = localStorage.getItem('dashboardPageSize');
    const storedPageIndex = localStorage.getItem('dashboardPageIndex');
    if (storedPageSize) this.pageSize = parseInt(storedPageSize);
    if (storedPageIndex) this.currentPageIndex = parseInt(storedPageIndex);

    this.classesService.classesOfUser().subscribe({
      next: (classes: Class[]) => {
        this._classes = classes;
      }
    });

    this.assignmentService.retrieveAssignments().subscribe({
      next: (assignments: Assignment[]) => {
        this._assignments = assignments;
        this._assignments.forEach((assignment) => {
          const classId = assignment.classId;
          const className = this.classesService.classWithId(classId);
          className.subscribe(cls => {
            assignment.className = cls?.name || 'Unknown Class';
          });
        });
        this.updatePagedAssignments();
      }
    });

    const userId: string | null = this.authService.retrieveUserId();

    if(userId) {
      this.groupService.getAllGroupsFromUser(userId)
        .subscribe(response => this._groups = response);
    }
  }

  public get assignments(): Assignment[] {
    return this._assignments;
  }

  public get classes(): Class[] {
    return this._classes;
  }

  public get groups(): GroupFilledIn[] {
    return this._groups;
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
