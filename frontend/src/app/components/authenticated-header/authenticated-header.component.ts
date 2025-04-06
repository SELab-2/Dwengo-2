import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationService } from '../../services/authentication.service';
import { UserType } from '../../interfaces';

@Component({
  selector: 'app-authenticated-header',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './authenticated-header.component.html',
  styleUrl: './authenticated-header.component.less'
})
export class AuthenticatedHeaderComponent implements OnInit {
  isStudent: boolean = false;
  
  constructor(
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.isStudent = this.authenticationService.retrieveUserType() === UserType.STUDENT;
  }

  logout() {
    this.authenticationService.logout();
  }

}
