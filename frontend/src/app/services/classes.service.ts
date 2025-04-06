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
import { ErrorService } from "./error.service";
import { User, UserType } from "../interfaces";
import { UserService } from "./user.service";
import { ClassMembersInterface } from "../interfaces/classes/classMembersResponse";

@Injectable({
    providedIn: 'root'
  })
  export class ClassesService {

    private API_URL = environment.API_URL;
    private userCreds;
    private standardHeaders;
  
    public constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
        private errorService: ErrorService,
        private userService: UserService
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
  
    public classesOfUser(): Observable<Class[]> {
        return this.http.get<ClassesReponse>(
            `${this.API_URL}/users/${this.userCreds.userId}/classes`,
            this.standardHeaders
        ).pipe(
            this.errorService.pipeHandler(),
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
        ).pipe(
            this.errorService.pipeHandler(
                this.errorService.retrieveError($localize `class`)
            ),
        );
    }

    public createClass(newClass: NewClass): Observable<string> {
        return this.http.post<NewClassResponse>(
            `${this.API_URL}/classes`,
            newClass,
            this.standardHeaders
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(
                response => of(response.id)
            )
        );
    }

    public deleteClass(id: string): Observable<boolean> {
        return this.http.delete(
            `${this.API_URL}/classes/${id}`, {
                ...this.standardHeaders,
                observe: 'response'
            }
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(
                response => of(response.status === 204) // 204: success & no content
            )
        );
    }

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
            this.errorService.pipeHandler(),
            switchMap(
                response => of(response.status === 204)
            )
        );
    }

    public classStudents(id: string): Observable<User[]> {
        // return this.http.get<ClassMembersInterface>(
        //     `${this.API_URL}/classes/${id}/users`,
        //     this.standardHeaders
        // ).pipe(
        //     this.errorService.pipeHandler(),
        //     switchMap(response => 
        //         forkJoin(
        //             response.students.map(studentId => 
        //                 this.userService.userWithIdAndType(studentId, UserType.STUDENT)
        //             )
        //         )
        //     )
        // );

        return of([
            {
                id: "123",
                email: "dries@mail.com",
                firstName: "Dries",
                familyName: "De Vries",
                schoolName: "De School",
                passwordHash: "123456789"
            },
            {
                id: "321",
                email: "zot@mail.com",
                firstName: "Gerdy",
                familyName: "Den Zot",
                schoolName: "De School",
                passwordHash: "1234567890"
            }
        ]);
    }

  }
 