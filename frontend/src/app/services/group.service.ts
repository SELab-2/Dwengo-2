import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of, switchMap } from "rxjs";
import { environment } from "../../environments/environment";
import { User } from "../interfaces";
import { AuthenticationService } from "./authentication.service";
import { ErrorService } from "./error.service";
import { NewGroup } from "../interfaces/group/newGroup";
import { GroupResponse } from "../interfaces/group/groupResponse";
import { GroupFilledIn } from "../interfaces/group/groupFilledIn";
import { UserService } from "./user.service";
import { AssignmentService } from "./assignment.service";
import { Assignment } from "../interfaces/assignment";
import { Groups } from "../interfaces/group/groups";


@Injectable({
    providedIn: 'root'
})
export class GroupService {

    private API_URL = environment.API_URL;
    public constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
        private errorService: ErrorService,
        private userService: UserService,
        private assignmentService: AssignmentService
    ) {}

    public getAllGroupsFromUser(userId: string): Observable<GroupFilledIn[]> {
        const headers = this.authService.retrieveAuthenticationHeaders();

        return this.http.get<Groups>(
            `${this.API_URL}/user/${userId}/groups`,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(groups => 
                forkJoin(
                    groups.groups.map(groupId => 
                        this.getGroup(groupId)
                    )
                )
            )
        );
    }

    public getGroup(id: string): Observable<GroupFilledIn> {
        return of({
            id: id,
            assignment: {
                id: '321',
                classId: '123',
                startDate: new Date(),
                deadline: new Date(),
                extraInstructions: 'Extra instructions',
                learningPathId: '123',
                name: 'Super coole assignment'
            },
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
                        this.userService.userWithId(memberId)
                    )
                ).pipe(
                    this.errorService.pipeHandler(),

                    // Map the group to the group with it's users filled in
                    switchMap(users => 
                        this.assignmentService.retrieveAssignmentById(group.assignment)
                            .pipe(
                                this.errorService.pipeHandler(),
                                switchMap(assignment => of({
                                    id: group.id,
                                    assignment: assignment,
                                    members: users
                                }))
                            )
                    )
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
