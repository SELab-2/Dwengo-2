import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { UnauthorizedGuard } from "./unauthorized.guard";
import { AuthenticationService } from "../services/authentication.service";

describe('UnauthorizedGuard', () => {
    let guard: UnauthorizedGuard;
    let authenticationService: jasmine.SpyObj<AuthenticationService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(() => {
        authenticationService = jasmine.createSpyObj('AuthenticationService', ['retrieveUserId']);
        routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

        TestBed.configureTestingModule({
            providers: [
                UnauthorizedGuard,
                { provide: AuthenticationService, useValue: authenticationService },
                { provide: Router, useValue: routerSpy }
            ]
        });

        guard = TestBed.inject(UnauthorizedGuard);
    });

    it('should be created', () => {
        expect(guard).toBeTruthy();
    });

    it('should allow access if user is not logged in', () => {
        authenticationService.retrieveUserId.and.returnValue(null);

        const result = guard.canActivate();
        expect(result).toBeTrue();
        expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should deny access and navigate if user is logged in', () => {
        authenticationService.retrieveUserId.and.returnValue("someUserId");

        const result = guard.canActivate();
        expect(result).toBeFalse();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('already-authenticated');
    });
});
