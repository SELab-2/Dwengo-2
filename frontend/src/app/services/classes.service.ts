import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { of, Observable, forkJoin, switchMap, delay } from 'rxjs';
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
  export class ClassesService {

    private API_URL = environment.API_URL;
    private userCreds;
    private standardHeaders;
  
    public constructor(
        private http: HttpClient,
        private authService: AuthenticationService
    ) {
        // TODO: user service (bram does this)
        // this.userCreds = {
        //     userId: "219c1e2f-488a-4f94-a9d8-38b7c9bede1f",
        //     "userToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxOWMxZTJmLTQ4OGEtNGY5NC1hOWQ4LTM4YjdjOWJlZGUxZiIsImlhdCI6MTc0MzUyMDU3NCwiZXhwIjoxNzQzNTI0MTc0fQ.pAe5kWa1ykaNS8J3GDWWIvyU1D79faUmcPXy7W0axx0"
        // };

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
  
    public classesOfUser(): Observable<Class[]> {
        return this.http.get<ClassesReponse>(
            `${this.API_URL}/users/${this.userCreds.userId}/classes`,
            this.standardHeaders
        ).pipe(
            switchMap(response => 
                forkJoin(
                    response.classes.map(id => 
                        this.http.get<Class>(
                            `${this.API_URL}/classes/${id}`,
                            this.standardHeaders
                        )
                    )
                )
            )
        );
    }

    public classWithId(id: string): Observable<Class> {
        return this.http.get<Class>(
            `${this.API_URL}/classes/${id}`,
            this.standardHeaders
        );
    }

    public createClass(newClass: NewClass): Observable<string> {
        return this.http.post<NewClassResponse>(
            `${this.API_URL}/classes`,
            newClass,
            this.standardHeaders
        ).pipe(
            switchMap(
                response => of(response.id)
            )
        );
    }

    // TODO: wait for bugfix API
    public deleteClass(id: string): Observable<boolean> {
        return this.http.delete(
            `${this.API_URL}/classes/${id}`, {
                ...this.standardHeaders,
                observe: 'response'
            }
        ).pipe(
            switchMap(
                response => of(response.status === 204) // 204: success & no content
            )
        );
    }
    
    // TODO: wait for bugfix API
    public updateClass(_class: Class): Observable<boolean> {
        const updatedClass: UpdatedClass = {
            name: _class.name,
            description: _class.description,
            targetAudience: _class.targetAudience
        };

        return this.http.patch(
            `${this.API_URL}/classes/${_class.id}`,
            updatedClass, {
                ...this.standardHeaders,
                observe: 'response'
            }
        ).pipe(
            switchMap(
                response => of(response.status === 204)
            )
        );
    }

  }
