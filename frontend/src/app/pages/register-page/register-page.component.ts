import { Component } from '@angular/core';
import { UnauthenticatedHeaderComponent } from '../../components/unauthenticated-header/unauthenticated-header.component';
import { RegisterComponent } from '../../components/register/register.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [UnauthenticatedHeaderComponent, RegisterComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.less'
})
export class RegisterPageComponent {

}
