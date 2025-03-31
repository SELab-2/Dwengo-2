import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { of, Observable, forkJoin, switchMap, map } from 'rxjs';
import { Class } from "../interfaces/classes/class";
import { NewClass } from "../interfaces/classes/newClass";

@Injectable({
    providedIn: 'root'
  })
  export class ClassesService {

    // TODO: use API_URL from /environments/environment.ts

    private userCreds;
  
    public constructor(private http: HttpClient) {
        this.userCreds = {
            "userId": "ff534bac-9c13-43f1-8cd0-01db69bb425a",
            "userToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZmNTM0YmFjLTljMTMtNDNmMS04Y2QwLTAxZGI2OWJiNDI1YSIsImlhdCI6MTc0MzQxODQwNiwiZXhwIjoxNzQzNDIyMDA2fQ.U2ktN4gBCpt95hoWS5af6wPirqh1zYxfN9Gf6L9gZes"
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
        
        const ids$: Observable<string[]> = this.http.get<string[]>(
            `http://localhost:3001/users/${this.userCreds.userId}/classes`,
            headers
        );

        return of([]);
        // return ids$
        //     .pipe(
        //         switchMap((ids) => 
        //             forkJoin(
        //                 ids.map((id) =>
        //                     this.http.get<Class>(
        //                         `http://localhost:3001/classes/${id}`,
        //                         headers
        //                     )
        //                 )
        //             )
        //         )
        //     )

        // // window.alert("123");
        // // // return of([]);

        // // // let ids: string[];
        // // // ids$.subscribe((_ids: string[]) => ids=_ids);

        // // return of([]);

        // return ids$
        //     .pipe(
        //         switchMap(
        //             (ids: string[]) => 
        //                 forkJoin(
        //                     ids.map((id: string) =>
        //                         this.http.get<Class>(
        //                             `http://localhost:3001/classes/${id}`,
        //                             headers
        //                         )
        //                     )
        //                 )
        //         )
        //     );


    }

    public classWithId(id: string): Observable<Class> {
        // TODO
        if(id === "321") {
            return of({
                name: "Math",
                description: "Mathematics",
                targetAudience: "Students",
                teacherId: "123",
                classId: "321"
            });
        } else {
            return of({
                name: "Economics",
                description: "Price go up, price go down",
                targetAudience: "Students",
                teacherId: "123",
                classId: "4321"
            });
        }
    }

    // TODO: vergadering 10 => de creates geven enkel id's
    public createClass(newClass: NewClass): Observable<string> {
        return of(newClass.name + "123");
    }

    // TODO
    public deleteClass(classId: string): Observable<boolean> {
        return of(classId !== undefined);
    }
    
    // TODO
    public updateClass(_class: Class): Observable<Class> {
        return of({
            name: _class.name,
            description: _class.description,
            targetAudience: _class.targetAudience,
            teacherId: _class.teacherId,
            classId: _class.classId
        });
    }

  }
