import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { of, Observable, forkJoin, switchMap } from 'rxjs';
import { Class } from "../interfaces/classes/class";
import { NewClass } from "../interfaces/classes/newClass";
import { UpdatedClass } from "../interfaces/classes/updatedClass";
import { NewClassResponse } from "../interfaces/classes/newClassResponse";
import { ClassesReponse } from "../interfaces/classes/classesResponse";
import { environment } from "../../environments/environment";
import { AuthenticationService } from "./authentication.service";

@Injectable({
    providedIn: 'root'
})
export class QuestionService {

    private API_URL = environment.API_URL;
    private userCreds;
    private standardHeaders;

    public constructor(
        private http: HttpClient,
        private authService: AuthenticationService
    ) {
        this.userCreds = {
            userId: this.authService.retrieveUserId(),
            userToken: this.authService.retrieveToken()
        };

        this.standardHeaders = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.userCreds.userToken}`
            }
        };
    }

}
