import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { of, Observable, tap, forkJoin, switchMap } from 'rxjs';
import { Class } from "../interfaces/classes/class";
import { NewClass } from "../interfaces/classes/newClass";

interface ClassesReponse {
    classes: string[]
}

@Injectable({
    providedIn: 'root'
  })
  export class ClassesService {

    // TODO: use API_URL from /environments/environment.ts

    private userCreds;
  
    public constructor(private http: HttpClient) {
        this.userCreds = {
            "userId": "219c1e2f-488a-4f94-a9d8-38b7c9bede1f",
            "userToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxOWMxZTJmLTQ4OGEtNGY5NC1hOWQ4LTM4YjdjOWJlZGUxZiIsImlhdCI6MTc0MzQ0ODgyNywiZXhwIjoxNzQzNDUyNDI3fQ.IGY_mzLrSW6WQW-GFJ8upgLbYEvjiwAxL9a1DK4MeCs"
        };
    }
  
    // TODO
    // Also needs headers
    public classesOfUSer(): Observable<Class[]> {

        const headers = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.userCreds.userToken}`
            }
        };
        
        const classIds$: Observable<ClassesReponse> = this.http.get<ClassesReponse>(
            `http://localhost:3001/users/${this.userCreds.userId}/classes`,
            headers
        )

        return classIds$
            .pipe(
                switchMap((response,) => {
                    const ids = response.classes;

                    const classes$ = ids.map((id) => {
                        return this.http.get<Class>(
                            `http://localhost:3001/classes/${id}`,
                            headers
                        )
                    })

                    return forkJoin(classes$);
                })
            );
    }

    public classWithId(id: string): Observable<Class> {
        // TODO
        if(id === "321") {
            return of({
                name: "Math",
                description: "Mathematics",
                targetAudience: "Students",
                teacherId: "123",
                id: "321"
            });
        } else {
            return of({
                name: "Economics",
                description: "Price go up, price go down",
                targetAudience: "Students",
                teacherId: "123",
                id: "4321"
            });
        }
    }

    // TODO: vergadering 10 => de creates geven enkel id's
    public createClass(newClass: NewClass): Observable<string> {
        return of(newClass.name + "123");
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
