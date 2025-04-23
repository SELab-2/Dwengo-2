import { Injectable } from "@angular/core";
import { User } from "../interfaces";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    public createGroups(members: User[][], assignmentId: string): Observable<boolean> {
        return of(true);
    }

}
