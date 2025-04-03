import { catchError, Observer, of, OperatorFunction } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class ErrorService {

    // Snackbar
    private readonly snackBar = inject(MatSnackBar);

    // Mapping from HTTP code to handler
    private readonly handleCode = {
        401: this.handle401.bind(this),
        404: this.handle404.bind(this),
        409: this.handle409.bind(this),
        500: this.handle500.bind(this)
    };

    /**
     * Handles HTTP errors in an RXJS pipe stream.
     * When using `pipe()` on an observable, you should use this method to handle errors.
     * 
     * It should be used like this:
     * ```ts
     * this.http.get("url")
     *   .pipe(
     *     errorService.pipeHandler(),
     *     ... // The rest of your pipeline
     *   )
     * ```
     * 
     * In essence this function is a wrapper of `catchError`
     * 
     * @returns The observable if no errors occured otherwise null.
     */
    public pipeHandler<T>(): OperatorFunction<T, T | null> {
        return (source) => {
            return source.pipe(
                catchError((error: HttpErrorResponse) => {
                    this.handleHttpError(error);
                    return of(null);
                })
            );
        };
    }

    /**
     * Handles HTTP errors in an RXJS subscription.
     * When using `subscribe()` on an observable, you should use this method to handle errors.
     * It serves as a wrapper of the usual function you would pass to `subscribe()` but handles errors for you.
     * 
     * It should be used like this:
     * ```ts
     * this.http.get("url")
     *   .subscribe(
     *     errorService.subscribeHandler({
     *       next: (value) => {
     *         // Do something with the value
     *       }
     *     })
     *   )
     * ```
     * 
     * @param next The function to call when the observable emits a value.
     * @returns An observer (the object you would pass to `subscribe()`) that handles errors for you.
     */
    public subscribeHandler<T>(next: (value: T) => void): Observer<T> {
        return {
            next: next,
            error: this.handleHttpError.bind(this),
            complete: () => {}
        };
    }

    /**
     * Handle the HTTP error by calling the appropriate handler defined in `handleCode`.
     * 
     * @param error The HTTP error
     */
    private handleHttpError(error: HttpErrorResponse): void {
        const status = error.status as keyof typeof this.handleCode;

        if(this.handleCode.hasOwnProperty(status)) {
            this.handleCode[status]();
        } else {
            this.openSnackBar("Unknown error");
        }
    }

    // Authentication required
    private handle401() {
        this.openSnackBar("401");
    }

    // Not found
    private handle404() {
        this.openSnackBar("404");
    }

    // Conflict (resource already exists)
    private handle409() {
        this.openSnackBar("409");
    }

    // Internal server error
    private handle500() {
        this.openSnackBar("500");
    }

    private openSnackBar(message: string, action: string="Ok") {
        this.snackBar.open(message, action, {
            duration: 2500
        });
    }

}
