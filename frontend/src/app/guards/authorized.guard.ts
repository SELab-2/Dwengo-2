import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: 'root',
})
export class AuthorizedGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService,
  ) {}

  allowedTypes = ["student", "teacher"];

  canActivate(
    route: ActivatedRouteSnapshot,
  ): boolean {
    // Check if you're authenticated
    const userTypeOK = this.authenticationService.retrieveUserType() !== null;
    if (!userTypeOK) this.router.navigateByUrl('unauthorized');
    return userTypeOK;
  }
  
}
