import { Component } from '@angular/core';
import { UnauthenticatedHeaderComponent } from '../../components/unauthenticated-header/unauthenticated-header.component';
import { LoginComponent } from '../../components/login/login.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [UnauthenticatedHeaderComponent, LoginComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.less'
})
export class LoginPageComponent {

}
