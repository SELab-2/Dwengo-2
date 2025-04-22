import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { AuthorizedGuard } from "./authorized.guard";
import { UserType } from "../interfaces";


describe('AuthorizedGuard', () => {
    let guard: AuthorizedGuard;
    let authenticationService: jasmine.SpyObj<AuthenticationService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(() => {
        authenticationService = jasmine.createSpyObj('AuthenticationService', ['retrieveUserType']);
        routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

        TestBed.configureTestingModule({
            providers: [
                AuthorizedGuard,
                { provide: AuthenticationService, useValue: authenticationService },
                { provide: Router, useValue: routerSpy }
            ]
        });

        guard = TestBed.inject(AuthorizedGuard);
    });

    it('should allow access if user type is student', () => {
        authenticationService.retrieveUserType.and.returnValue(UserType.STUDENT);

        const result = guard.canActivate({} as ActivatedRouteSnapshot);
        expect(result).toBeTrue();
        expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should allow access if user type is teacher', () => {
        authenticationService.retrieveUserType.and.returnValue(UserType.TEACHER);

        const result = guard.canActivate({} as ActivatedRouteSnapshot);
        expect(result).toBeTrue();
        expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should deny access and navigate to unauthorized if user type is null', () => {
        authenticationService.retrieveUserType.and.returnValue(null);

        const result = guard.canActivate({} as ActivatedRouteSnapshot);
        expect(result).toBeFalse();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('unauthorized');
    });
});

