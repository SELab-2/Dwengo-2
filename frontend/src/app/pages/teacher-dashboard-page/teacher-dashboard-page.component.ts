import { Component } from '@angular/core';
import { TeacherDashboardComponent } from '../../components/dashboard/teacher-dashboard.component';

@Component({
  selector: 'app-teacher-dashboard-page',
  standalone: true,
  imports: [TeacherDashboardComponent],
  templateUrl: './teacher-dashboard-page.component.html',
  styleUrls: ['./teacher-dashboard-page.component.less']
})
export class TeacherDashboardPageComponent { }
