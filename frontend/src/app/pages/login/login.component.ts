import { Component } from '@angular/core';
import { UnauthenticatedHeaderComponent } from '../../components/unauthenticated-header/unauthenticated-header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [UnauthenticatedHeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent {

}
