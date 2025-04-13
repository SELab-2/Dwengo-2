import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { UserTypeGuard } from "./usertype.guard";
import { AuthenticationService } from "../services/authentication.service";
import { UserType } from "../interfaces";


describe('UserTypeGuard', () => {
    let guard: UserTypeGuard;
    let authenticationService: jasmine.SpyObj<AuthenticationService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let routeSnapShot: jasmine.SpyObj<ActivatedRouteSnapshot>;

    beforeEach(() => {
        authenticationService = jasmine.createSpyObj('AuthenticationService', ['retrieveUserType']);
        routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

        TestBed.configureTestingModule({
            providers: [
                UserTypeGuard,
                { provide: AuthenticationService, useValue: authenticationService },
                { provide: Router, useValue: routerSpy }
            ]
        });

        guard = TestBed.inject(UserTypeGuard);
    });

    it('should be created', () => {
        expect(guard).toBeTruthy();
    })

    it('should allow access if user type matches student', () => {
        routeSnapShot = jasmine.createSpyObj('ActivatedRouteSnapshot', ['data']);
        routeSnapShot.data = { userType: "student" };
        authenticationService.retrieveUserType.and.returnValue(UserType.STUDENT);

        const result = guard.canActivate(routeSnapShot);
        expect(result).toBeTrue();
        expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should allow access if user type matches teacher', () => {
        routeSnapShot = jasmine.createSpyObj('ActivatedRouteSnapshot', ['data']);
        routeSnapShot.data = { userType: "teacher" };
        authenticationService.retrieveUserType.and.returnValue(UserType.TEACHER);

        const result = guard.canActivate(routeSnapShot);
        expect(result).toBeTrue();
        expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should deny access and navigate to unauthorized if user type does not match', () => {
        routeSnapShot = jasmine.createSpyObj('ActivatedRouteSnapshot', ['data']);
        routeSnapShot.data = { userType: "teacher" };
        authenticationService.retrieveUserType.and.returnValue(UserType.STUDENT);

        const result = guard.canActivate(routeSnapShot);
        expect(result).toBeFalse();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('unauthorized');
    });
});
