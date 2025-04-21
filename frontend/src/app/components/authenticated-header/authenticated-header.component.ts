import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationService } from '../../services/authentication.service';
import { UserType } from '../../interfaces';
import { AuthenticatedMenuComponent } from '../authenticated-menu/authenticated-menu.component';

@Component({
  selector: 'app-authenticated-header',
  imports: [MatButtonModule, AuthenticatedMenuComponent],
  templateUrl: './authenticated-header.component.html',
  styleUrl: './authenticated-header.component.less'
})
export class AuthenticatedHeaderComponent implements OnInit {
  isStudent: boolean = false;
  
  private readonly STUDENT_DASHBOARD_URL = '/student/dashboard';
  private readonly TEACHER_DASHBOARD_URL = '/teacher/dashboard';
  
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.isStudent = this.authenticationService.retrieveUserType() === UserType.STUDENT;
  }

  logout() {
    this.authenticationService.logout();
  }

  goToDashboard() {
    const userType = this.authenticationService.retrieveUserType();

    let dashboardURL = null;

    if (userType === UserType.STUDENT) {
      dashboardURL = this.STUDENT_DASHBOARD_URL;
    }

    if (userType === UserType.TEACHER) {
      dashboardURL = this.TEACHER_DASHBOARD_URL;
    }

    if (dashboardURL) {
      this.router.navigateByUrl(dashboardURL);
    } else {
      console.error('User type not recognized or no dashboard URL available.');
    }
    
  }

}
