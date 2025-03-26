import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { Class } from "../interfaces/classes/class";

@Injectable({
    providedIn: 'root'
  })
  export class ClassesService {
  
    constructor(private http: HttpClient) {}
  
    // TODO
    // Also needs headers
    classesOfUSer(): Observable<Class[]> {
        // const id = "123";
        // const classId= "321";
        // return this.http.get<Class>(`http://localhost:3001/teacher/${id}/classes/${classId}`);

        return of([
            {
                name: "Math",
                description: "Mathematics",
                targetAudience: "Students",
                teacherId: "123",
                classId: "321"
            },
            {
                name: "Economics",
                description: "Price go up, price go down",
                targetAudience: "Students",
                teacherId: "123",
                classId: "4321"
            }
        ]);

    }
    
  }
