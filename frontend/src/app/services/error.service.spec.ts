import { of, throwError } from "rxjs";
import { ErrorMiddleware, ErrorService } from "./error.service";
import { TestBed } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpErrorResponse } from "@angular/common/http";


describe('ErrorService', () => {

    let service: ErrorService;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        // https://stackoverflow.com/questions/74614903/using-the-angular-14-inject-and-how-to-run-this-in-a-test
        snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

        TestBed.configureTestingModule({
            providers: [
                { provide: MatSnackBar, useValue: snackBarSpy },
            ]
        });

        service = TestBed.inject(ErrorService);
    });

    it('should pipe non error message through', () => {
        const testMessage = "Test message";
        const testObservable = of(testMessage);

        const result = service.pipeHandler<string>(testMessage)(testObservable);

        result.subscribe(value => {
            expect(value).toEqual(testMessage);
        });
    });

    it('should call handleHttpError and return null when an HttpErrorResponse occurs', (done) => {
        spyOn(service, 'handleHttpError').and.callThrough();

        const errorMessage = 'An error occurred';
        const httpError = new HttpErrorResponse({
            status: 500,
            statusText: 'Internal Server Error',
        });

        const source$ = throwError(() => httpError);

        // Use the pipeHandler
        source$.pipe(service.pipeHandler(errorMessage)).subscribe({
            next: () => {
                fail('Expected no value to be emitted');
            },
            error: () => {
                fail('Expected no error to be thrown');
            },
            complete: () => {
                expect(service.handleHttpError).toHaveBeenCalledWith(httpError, errorMessage);
                done();
            },
        });
    });

    it('should apply middleware and stop if middleware does not call next', (done) => {
        // eslint-disable-next-line
        const middleware: ErrorMiddleware = jasmine.createSpy('middleware', (_, __) => {}).and.callThrough();
        service.registerMiddleware(middleware);

        const httpError = new HttpErrorResponse({ status: 500 });
        const source$ = throwError(() => httpError);

        spyOn(service, 'handleHttpError');

        source$.pipe(service.pipeHandler()).subscribe({
            complete: () => {
                expect(middleware).toHaveBeenCalled();
                expect(service.handleHttpError).not.toHaveBeenCalled();
                done();
            }
        });
    });

    it('should apply middleware and call handleHttpError if next is called', (done) => {
        const middleware: ErrorMiddleware = (_, next) => next(_);
        service.registerMiddleware(middleware);

        const httpError = new HttpErrorResponse({ status: 500 });
        const source$ = throwError(() => httpError);

        spyOn(service, 'handleHttpError').and.callThrough();

        source$.pipe(service.pipeHandler('Test error')).subscribe({
            complete: () => {
                expect(service.handleHttpError).toHaveBeenCalledWith(httpError, 'Test error');
                done();
            }
        });
    });
});
