import { inject, Injectable } from "@angular/core";
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class ErrorAuthHandlerService {
    private readonly snackBar = inject(MatSnackBar);

    constructor() {}

    public register(error: ErrorService, auth: AuthenticationService) {
        console.log("registering");
        error.registerMiddleware((err, next) => {
            if (err.status === 401 && auth.retrieveRefreshToken() && err.error?.message === "Invalid or expired token") {
                try {
                    auth.refresh();
                    this.openSnackBar($localize `:@@sessionRefreshed:Session successfully updated`);
                }
                catch {
                    auth.logout();
                    next(err);
                }
            } else {
                next(err);
            }
        });
    }

    private openSnackBar(message: string, action: string=$localize `:@@ok:Ok`) {
        this.snackBar.open(message, action, {
            duration: 2500
        });
    }
}
