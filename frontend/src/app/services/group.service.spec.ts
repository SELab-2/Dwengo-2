import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthenticationService } from "./authentication.service";
import { ErrorService } from "./error.service";
import { UserService } from "./user.service";
import { AssignmentService } from "./assignment.service";
import { GroupService } from "./group.service";
import { Observable, of } from "rxjs";
import { User } from "../interfaces";
import { Assignment } from "../interfaces/assignment";
import { GroupResponse } from "../interfaces/group/groupResponse";
import { Groups } from "../interfaces/group/groups";


describe('GroupService', () => {
    let http: jasmine.SpyObj<HttpClient>;
    let authService: jasmine.SpyObj<AuthenticationService>;
    let errorService: jasmine.SpyObj<ErrorService>;
    let userService: jasmine.SpyObj<UserService>;
    let assignmentService: jasmine.SpyObj<AssignmentService>;
    let service: GroupService;

    const token: string = '123';
    const userId: string = '321';
    const user: User = {
        id: userId,
        email: "alice@bob.com",
        firstName: "Alice",
        familyName: "Daubechies",
        schoolName: "Carol University",
        passwordHash: "1234"
    };
    const assignment: Assignment = {
        id: '123',
        classId: '123',
        startDate: new Date(),
        deadline: new Date(),
        extraInstructions: 'Extra instructions',
        learningPathId: '123',
        name: 'Constructing profile HMMs'
    };

    beforeEach(() => {
        http = jasmine.createSpyObj('HttpClient', ['get', 'post']);
        authService = jasmine.createSpyObj(['retrieveAuthenticationHeaders']);
        errorService = jasmine.createSpyObj('ErrorService', ['pipeHandler']);
        userService = jasmine.createSpyObj('UserService', ['userWithId']);
        assignmentService = jasmine.createSpyObj('AssignmentService', ['retrieveAssignmentById']);

        // Mock the return values of the AuthenticationService methods
        authService.retrieveAuthenticationHeaders.and.returnValue({
            headers: new HttpHeaders().append('Authorization', `Bearer ${token}`).append('Content-Type', 'application/json'),
        });

        // Mock the return values of the UserService methods
        userService.userWithId.and.returnValue(of(user));

        // Mock the return values of the AssignmentService methods
        assignmentService.retrieveAssignmentById.and.returnValue(of(assignment));

        // Mock the return values of the ErrorService methods
        errorService.pipeHandler.and.callFake(() => (source) => source);

        service = new GroupService(http, authService, errorService, userService, assignmentService);
    });

    it('get a group with an id', () => {
        const groupId = '123';
        const groupResponse: GroupResponse = {
            id: groupId,
            assignment: assignment.id,
            members: [user.id]
        };

        http.get.and.returnValue(of(groupResponse));

        service.getGroup(groupId).subscribe((group) => {
            expect(group.id).toEqual(groupId);
            expect(group.assignment).toEqual(assignment);
            expect(group.members).toEqual([user]);
        });
    });

    it('get all groups from a user', () => {
        const groupId = '123';
        const groupResponse: Groups = {
            groups: [groupId]
        };

        /* eslint-disable  @typescript-eslint/no-explicit-any */
        http.get.and.callFake((url: string): Observable<any> => {
            if (url.includes('/user')) {
                return of(groupResponse);
            } else if (url.includes('/groups')) {
                return of({
                    id: groupId,
                    assignment: assignment.id,
                    members: [user.id]
                });
            }
            return of(null);
        });

        service.getAllGroupsFromUser(userId).subscribe((groups) => {
            expect(groups.length).toBe(1);
            expect(groups[0].id).toEqual(groupId);
            expect(groups[0].assignment).toEqual(assignment);
            expect(groups[0].members).toEqual([user]);
        });
    });

    it('should create a group', () => {
        http.post.and.returnValue(of({ status: 201 }));

        service.createGroup([user], assignment.id).subscribe((response) => {
            expect(response).toBeTrue();
        });
    });

    it('should create all groups', () => {
        http.post.and.returnValue(of({ status: 201 }));

        service.createGroups([[user], [user]], assignment.id).subscribe((response) => {
            expect(response).toBeTrue();
        });
    });

});
