import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: 'root',
})
export class UserTypeGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
  ): boolean {
    const userTypeOK = this.authenticationService.retrieveUserType() === route.data['userType'];
    if (!userTypeOK) this.router.navigateByUrl('unauthorized');
    return userTypeOK;
  }
  
}
