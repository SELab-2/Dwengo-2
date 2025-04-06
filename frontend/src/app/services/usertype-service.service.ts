import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { UserType } from '../interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsertypeServiceService {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  public checkUserType(userType: UserType): void {
    if (userType !== this.authenticationService.retrieveUserType()) {
      this.router.navigateByUrl('/error');
    }
  }
}
