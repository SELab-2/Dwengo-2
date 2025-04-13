import { Component } from '@angular/core';
import { TeacherDashboardComponent } from '../../components/teacher-dashboard/teacher-dashboard.component';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';

@Component({
  selector: 'app-teacher-dashboard-page',
  standalone: true,
  imports: [TeacherDashboardComponent, AuthenticatedHeaderComponent],
  templateUrl: './teacher-dashboard-page.component.html',
  styleUrls: ['./teacher-dashboard-page.component.less']
})
export class TeacherDashboardPageComponent { }
