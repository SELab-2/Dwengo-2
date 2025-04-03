import { catchError, Observer, of, OperatorFunction } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class ErrorService {

    private readonly snackBar = inject(MatSnackBar);

    private readonly handleCode = {
        401: this.handle401.bind(this),
        404: this.handle404.bind(this),
        409: this.handle409.bind(this),
        500: this.handle500.bind(this)
    };

    // Wrapper of catchError
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

    public subscribeHandler<T>(next: (value: T) => void): Observer<T> {
        return {
            next: next,
            error: this.handleHttpError.bind(this),
            complete: () => {}
        };
    }

    private handleHttpError(error: HttpErrorResponse): void {
        const status = error.status as keyof typeof this.handleCode;
        this.handleCode[status]();
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
