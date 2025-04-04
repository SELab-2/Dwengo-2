import { Component } from '@angular/core';
import { StudentDashboardComponent } from '../../components/dashboard/student-dashboard.component';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';

@Component({
  selector: 'app-student-dashboard-page',
  standalone: true,
  imports: [StudentDashboardComponent, AuthenticatedHeaderComponent],
  templateUrl: './student-dashboard-page.component.html',
  styleUrls: ['./student-dashboard-page.component.less']
})
export class StudentDashboardPageComponent { }