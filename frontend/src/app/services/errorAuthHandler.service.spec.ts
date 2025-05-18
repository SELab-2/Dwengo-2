import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorAuthHandlerService } from './errorAuthHandler.service';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';

describe('ErrorAuthHandlerService', () => {
    let service: ErrorAuthHandlerService;
    let errorServiceSpy: jasmine.SpyObj<ErrorService>;
    let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        errorServiceSpy = jasmine.createSpyObj('ErrorService', ['registerMiddleware']);
        authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['retrieveRefreshToken', 'refresh', 'logout']);
        snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

        TestBed.configureTestingModule({
            providers: [
                ErrorAuthHandlerService,
                { provide: ErrorService, useValue: errorServiceSpy },
                { provide: AuthenticationService, useValue: authServiceSpy },
                { provide: MatSnackBar, useValue: snackBarSpy }
            ]
        });

        service = TestBed.inject(ErrorAuthHandlerService);
    });

    it('should register middleware with ErrorService', () => {
        service.register(errorServiceSpy, authServiceSpy);
        expect(errorServiceSpy.registerMiddleware).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('should call auth.refresh and show snackbar for 401 with valid refresh token', (done) => {
        authServiceSpy.retrieveRefreshToken.and.returnValue('valid-token');
        authServiceSpy.refresh.and.returnValue(undefined); // Simulate successful refresh

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let registeredMiddleware: any;
        errorServiceSpy.registerMiddleware.and.callFake((middleware) => registeredMiddleware = middleware);

        service.register(errorServiceSpy, authServiceSpy);

        const error = new HttpErrorResponse({
            status: 401,
            error: { message: 'Invalid or expired token' }
        });

        registeredMiddleware(error, () => fail('Next should not be called'));

        setTimeout(() => {
            expect(authServiceSpy.refresh).toHaveBeenCalled();
            expect(snackBarSpy.open).toHaveBeenCalledWith('Session successfully updated', 'Ok', { duration: 2500 });
            expect(authServiceSpy.logout).not.toHaveBeenCalled();
            done();
        }, 0);
    });

    it('should call next if refresh fails for 401 with valid refresh token', (done) => {
        authServiceSpy.retrieveRefreshToken.and.returnValue('valid-token');
        authServiceSpy.refresh.and.throwError('Refresh failed');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let registeredMiddleware: any;
        errorServiceSpy.registerMiddleware.and.callFake((middleware) => registeredMiddleware = middleware);

        service.register(errorServiceSpy, authServiceSpy);

        const error = new HttpErrorResponse({
            status: 401,
            error: { message: 'Invalid or expired token' }
        });

        registeredMiddleware(error, () => {
            expect(authServiceSpy.refresh).toHaveBeenCalled();
            expect(authServiceSpy.logout).toHaveBeenCalled();
            expect(snackBarSpy.open).not.toHaveBeenCalled();
            done();
        });
    });

    it('should call next for 401 without refresh token', (done) => {
        authServiceSpy.retrieveRefreshToken.and.returnValue(null);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let registeredMiddleware: any;
        errorServiceSpy.registerMiddleware.and.callFake((middleware) => registeredMiddleware = middleware);

        service.register(errorServiceSpy, authServiceSpy);

        const error = new HttpErrorResponse({
            status: 401,
            error: { message: 'Invalid or expired token' }
        });

        registeredMiddleware(error, () => {
            expect(authServiceSpy.refresh).not.toHaveBeenCalled();
            expect(authServiceSpy.logout).not.toHaveBeenCalled();
            expect(snackBarSpy.open).not.toHaveBeenCalled();
            done();
        });
    });

    it('should call next for non-401 errors', (done) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let registeredMiddleware: any;
        errorServiceSpy.registerMiddleware.and.callFake((middleware) => registeredMiddleware = middleware);

        service.register(errorServiceSpy, authServiceSpy);

        const error = new HttpErrorResponse({ status: 500 });

        registeredMiddleware(error, () => {
            expect(authServiceSpy.retrieveRefreshToken).not.toHaveBeenCalled();
            expect(authServiceSpy.refresh).not.toHaveBeenCalled();
            expect(authServiceSpy.logout).not.toHaveBeenCalled();
            expect(snackBarSpy.open).not.toHaveBeenCalled();
            done();
        });
    });
});
