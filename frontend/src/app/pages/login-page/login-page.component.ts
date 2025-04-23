import { Component } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { UnauthenticatedHeaderComponent } from '../../components/unauthenticated-header/unauthenticated-header.component';
import { LoginComponent } from '../../components/login/login.component';
import { UserType } from '../../interfaces';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [UnauthenticatedHeaderComponent, LoginComponent, TitleCasePipe, MatCardModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.less'
})
export class LoginPageComponent {

  userType: UserType;
  
  constructor(
    private route: ActivatedRoute
  ) {
    this.userType = this.route.snapshot.data['isTeacher'] ? UserType.TEACHER : UserType.STUDENT;
  }

}
