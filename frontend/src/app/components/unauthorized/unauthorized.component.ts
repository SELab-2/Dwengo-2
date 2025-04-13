import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-unauthorized',
  imports: [RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.less'
})
export class UnauthorizedComponent {

  constructor(
    public readonly authenticationService: AuthenticationService
  ) {}
  
}
