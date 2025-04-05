import { catchError, filter, Observer, of, OperatorFunction } from "rxjs";
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
     * It returns `null` if an error occurs, so whenever you call a certain service from a component
     * you only need to handle the visuals of the error. A snackbar to notify the user is already provided.
     * 
     * Example usage:
     * ```ts
     * this.http.get("url")
     *   .pipe(
     *     errorService.pipeHandler("Error message"),
     *     ... // The rest of your pipeline
     *   )
     * ```
     * 
     * In essence this function is a wrapper of `catchError`
     * 
     * @param errorMessage The error message to show in the snackbar
     * @returns The observable if no errors occured otherwise null
     */
    public pipeHandler<T>(errorMessage?: string): OperatorFunction<T, T> {
        return (source) => {
            return source.pipe(
                catchError((error: HttpErrorResponse) => {
                    this.handleHttpError(error, errorMessage);
                    return of(null);
                }),
                filter(value => value !== null) // Filter out null values
            );
        };
    }

    /**
     * Handles HTTP errors in an RXJS subscription.
     * When using `subscribe()` on an observable, you should use this method to handle errors.
     * It serves as a wrapper of the usual function you would pass to `subscribe()` but handles errors for you.
     * 
     * It does so by showing an appriopriate snackbar message to the user.
     * 
     * Example usage:
     * ```ts
     * this.http.get("url")
     *   .subscribe(
     *     errorService.subscribeHandler(
     *       errorMessage: "Error message", 
     *       next: (value) => {
     *         // Do something with the value
     *       }
     *     )
     *   )
     * ```
     * 
     * @param next The function to call when the observable emits a value
     * @param errorMessage The error message to show in the snackbar
     * @returns An observer (the object you would pass to `subscribe()`) that handles errors for you
     */
    public subscribeHandler<T>(next: (value: T) => void, errorMessage?: string): Observer<T> {
        return {
            next: next,
            error: (error) => this.handleHttpError(error, errorMessage),
            complete: () => {}
        };
    }

    /**
     * Handle the HTTP error by calling the appropriate handler defined in `handleCode`.
     * 
     * @param error The HTTP error
     * @param errorMessage The error message to show in the snackbar
     */
    public handleHttpError(error: HttpErrorResponse, errorMessage?: string): void {
        const status = error.status as keyof typeof this.handleCode;

        if(this.handleCode[status]) {
            if(errorMessage) errorMessage = errorMessage.toLocaleLowerCase();
            this.handleCode[status](errorMessage);
        } else {
            this.openSnackBar($localize `Unknown error`);
        }
    }

    // Authentication required
    private handle401(errorMessage?: string) {
        this.openSnackBar(
            `${errorMessage ? errorMessage + '. ' : ''}`
            + $localize `Authentication required.`
        );
    }

    // Not found
    private handle404(errorMessage?: string) {
        this.openSnackBar(
           `${errorMessage ? errorMessage + '. ' : ''}`
            + $localize `Not found.`
        );
    }

    // Conflict (resource already exists)
    private handle409(errorMessage?: string) {
        this.openSnackBar(
            `${errorMessage ? errorMessage + '. ' : ''}`
            + $localize `Conflict.`
        );
    }

    // Internal server error
    private handle500(errorMessage?: string) {
        this.openSnackBar(
            `${errorMessage ? errorMessage + '. ' : ''}`
            + $localize `Internal server error.`
        );
    }

    private openSnackBar(message: string, action: string=$localize `Ok`) {
        this.snackBar.open(message, action, {
            duration: 2500
        });
    }

    public retrieveError(retrieval: string): string {
        return $localize `An error occured whilst retrieving` + ` ${retrieval}`;
    }

    public updateError(update: string): string {
        return $localize `An error occured whilst updating` + ` ${update}`;
    }

    public createError(create: string): string {
        return $localize `An error occured whilst creating` + ` ${create}`;
    }

    public deleteError(deleteItem: string): string {
        return $localize `An error occured whilst deleting` + ` ${deleteItem}`;
    }   

}
