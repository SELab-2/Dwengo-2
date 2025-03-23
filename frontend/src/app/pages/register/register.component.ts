import { Component } from '@angular/core';
import { UnauthenticatedHeaderComponent } from '../../components/unauthenticated-header/unauthenticated-header.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [UnauthenticatedHeaderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.less'
})
export class RegisterComponent {

}
