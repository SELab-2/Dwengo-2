import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { of, Observable, tap, forkJoin, switchMap } from 'rxjs';
import { Class } from "../interfaces/classes/class";
import { NewClass } from "../interfaces/classes/newClass";

interface ClassesReponse {
    classes: string[]
}

interface NewClassResponse {
    id: string
}

@Injectable({
    providedIn: 'root'
  })
  export class ClassesService {

    // TODO: use API_URL from /environments/environment.ts

    private userCreds;
    private standardHeaders;
  
    public constructor(private http: HttpClient) {
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
                (response) => response.id
            )
        );
    }

    // TODO
    public deleteClass(id: string): Observable<boolean> {
        return of(id !== undefined);
    }
    
    // TODO
    public updateClass(_class: Class): Observable<Class> {
        return of({
            name: _class.name,
            description: _class.description,
            targetAudience: _class.targetAudience,
            teacherId: _class.teacherId,
            id: _class.id
        });
    }

  }
