import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of, switchMap } from "rxjs";
import { environment } from "../../environments/environment";
import { User } from "../interfaces";
import { AuthenticationService } from "./authentication.service";
import { ErrorService } from "./error.service";
import { NewGroup } from "../interfaces/group/newGroup";

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    private API_URL = environment.API_URL;
    public constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
        private errorService: ErrorService
    ) {}

    public createGroup(members: User[], assignmentId: string): Observable<boolean> {
        const headers = this.authService.retrieveAuthenticationHeaders();
        const newGroup: NewGroup = {
            assignment: assignmentId,
            members: members.map(member => member.id)
        };

        return this.http.post(
            `${this.API_URL}/groups`,
            newGroup, {
                ...headers,
                observe: 'response'
            }
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(response => of(response.status === 201))
        );
    }

    public createGroups(groups: User[][], assignmentId: string): Observable<boolean> {
        const id = (x: boolean) => x; // Identity
        
        return forkJoin(
            groups.map(group => this.createGroup(group, assignmentId))
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(responses => of(responses.every(id)))
        );
    }

}
