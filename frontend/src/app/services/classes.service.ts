import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { of, Observable, forkJoin, switchMap } from 'rxjs';
import { Class } from "../interfaces/classes/class";
import { NewClass } from "../interfaces/classes/newClass";

// TODO: move these to /interfaces
interface ClassesReponse {
    classes: string[]
}

interface NewClassResponse {
    id: string
}

interface UpdatedClass {
    name: string,
    description: string,
    targetAudience: string
}

@Injectable({
    providedIn: 'root'
  })
  export class ClassesService {

    // TODO: use API_URL from /environments/environment.ts

    private userCreds;
    private standardHeaders;
  
    public constructor(private http: HttpClient) {
        // TODO: user service (bram does this)
        this.userCreds = {
            "userId": "219c1e2f-488a-4f94-a9d8-38b7c9bede1f",
            "userToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxOWMxZTJmLTQ4OGEtNGY5NC1hOWQ4LTM4YjdjOWJlZGUxZiIsImlhdCI6MTc0MzQ5MTI1NiwiZXhwIjoxNzQzNDk0ODU2fQ.L3fLoyBsXlg0S54-DwAQmGQy3YQnhpoI-qa3ztyymz4"
        };

        this.standardHeaders = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.userCreds.userToken}`
            }
        }
    }
  
    public classesOfUser(): Observable<Class[]> {
        return this.http.get<ClassesReponse>(
            `http://localhost:3001/users/${this.userCreds.userId}/classes`,
            this.standardHeaders
        ).pipe(
            switchMap(response => 
                forkJoin(
                    response.classes.map(id => 
                        this.http.get<Class>(
                            `http://localhost:3001/classes/${id}`,
                            this.standardHeaders
                        )
                    )
                )
            )
        );
    }

    public classWithId(id: string): Observable<Class> {
        return this.http.get<Class>(
            `http://localhost:3001/classes/${id}`,
            this.standardHeaders
        );
    }

    public createClass(newClass: NewClass): Observable<string> {
        return this.http.post<NewClassResponse>(
            `http://localhost:3001/classes`,
            newClass,
            this.standardHeaders
        ).pipe(
            switchMap(
                response => response.id
            )
        );
    }

    // TODO: wait for bugfix API
    public deleteClass(id: string): Observable<boolean> {
        return this.http.delete(
            `http://localhost:3001/classes/${id}`, {
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
            `http://localhost:3001/classes/${_class.id}`,
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
