import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of, switchMap } from "rxjs";
import { environment } from "../../environments/environment";
import { User } from "../interfaces";
import { AuthenticationService } from "./authentication.service";
import { ErrorService } from "./error.service";
import { NewGroup } from "../interfaces/group/newGroup";
import { GroupResponse } from "../interfaces/group/groupResponse";
import { GroupWithUsers } from "../interfaces/group/groupWithUsers";
import { UserService } from "./user.service";

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    private API_URL = environment.API_URL;
    public constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
        private errorService: ErrorService,
        private userSerice: UserService
    ) {}

    public getGroup(id: string): Observable<GroupWithUsers> {
        return of({
            id: id,
            assignment: '123',
            members: [{
                id: '123', email: 'alice@bob.com', firstName: 'Alice', familyName: 'And Bob', schoolName: 'Carol University', passwordHash: '1234',
            }]
        });

        const headers = this.authService.retrieveAuthenticationHeaders();

        // Get the group with the given id
        return this.http.get<GroupResponse>(
            `${this.API_URL}/groups/${id}`,
            headers
        ).pipe(
            this.errorService.pipeHandler(),

            // Fill in the group with the users
            switchMap(group => 
                forkJoin(
                    // Get all users
                    group.members.map(memberId => 
                        this.userSerice.userWithId(memberId)
                    )
                ).pipe(
                    this.errorService.pipeHandler(),

                    // Map the group to the group with it's users filled in
                    switchMap(users => of({
                        id: group.id,
                        assignment: group.assignment,
                        members: users
                    }))
                )
            )
        );
    }

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
