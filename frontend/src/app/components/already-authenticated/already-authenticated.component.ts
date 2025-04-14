import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { UserType } from '../../interfaces';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-already-authenticated',
  imports: [RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './already-authenticated.component.html',
  styleUrl: './already-authenticated.component.less'
})
export class AlreadyAuthenticatedComponent {
  
  private readonly STUDENT_DASHBOARD_URL = '/student/dashboard';
  private readonly TEACHER_DASHBOARD_URL = '/teacher/dashboard';

  constructor(
    private readonly router: Router,
    public readonly authenticationService: AuthenticationService,
  ) {}

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
