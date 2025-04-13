import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: "root",
})
export class UnauthorizedGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService,
  ) {}

  canActivate() : boolean {
    const isLoggedIn = this.authenticationService.retrieveUserId() !== null;
    if (isLoggedIn) this.router.navigateByUrl("already-authenticated");
    return !isLoggedIn;
  }

}
