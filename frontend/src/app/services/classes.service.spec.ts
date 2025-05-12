import { Observable, of } from "rxjs";
import { Class } from "../interfaces/classes/class";
import { ClassesService } from "./classes.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NewClassResponse } from "../interfaces/classes/newClassResponse";
import { ClassesReponse } from "../interfaces/classes/classesResponse";
import { AuthenticationService } from "./authentication.service";
import { ErrorService } from "./error.service";
import { UserService } from "./user.service";
import { UsersOfClass } from "../interfaces/user/usersOfClass";
import { User } from "../interfaces";

describe('ClassesService', () => {
    let http: jasmine.SpyObj<HttpClient>;
    let authService: jasmine.SpyObj<AuthenticationService>;
    let errorService: jasmine.SpyObj<ErrorService>;
    let userService: jasmine.SpyObj<UserService>;
    let service: ClassesService;

    const id: string = "123";
    const name: string = "programming";
    const description: string = "programming for old people";
    const targetAudience: string = "old people";
    const teacherId: string = "321";
    const teacherToken: string = "mockToken";

    const _class: Class = {
        id,
        name,
        description,
        targetAudience,
        teacherId
    };

    const _newClassResponse: NewClassResponse = {
        id: id
    };

    const _classesResponse: ClassesReponse = {
        classes: [id]
    }

    beforeEach(() => {
        http = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete', 'patch']);
        authService = jasmine.createSpyObj('AuthenticationService', ['retrieveUserId', 'retrieveToken', 'retrieveUserType', 'retrieveAuthenticationHeaders', 'retrieveUserCredentials']);
        errorService = jasmine.createSpyObj('ErrorService', ['pipeHandler', 'subscribeHandler', 'retrieveError']);
        userService = jasmine.createSpyObj('UserService', ['userWithId', 'userWithIdAndType']);

        // Mock the return values of the AuthenticationService methods
        authService.retrieveUserId.and.returnValue(teacherId);
        authService.retrieveToken.and.returnValue(teacherToken);
        authService.retrieveAuthenticationHeaders.and.returnValue({
            headers: new HttpHeaders().append('Authorization', `Bearer ${teacherToken}`).append('Content-Type', 'application/json'),
        });
        authService.retrieveUserCredentials.and.returnValue({
            userId: teacherId,
            token: teacherToken,
        });

        // Mock the return values of the ErrorService methods
        errorService.pipeHandler.and.callFake(() => (source) => source);
        errorService.retrieveError.and.returnValue("mockError");

        // Mock the return values of the UserService methods


        service = new ClassesService(http, authService, errorService, userService);
    });

    it('should respond with classes', () => {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        http.get.and.callFake((url: string): Observable<any> => {
            if (url.includes('/users')) {
                return of(_classesResponse);
            } else if (url.includes('/classes')) {
                return of(_class);
            }
            return of(null);
        });

        service.classesOfUser().subscribe((response: Class[]) => {
            expect(response).toEqual([_class]);
        });
    });

    it('should return the correct amount of users in the class', () => {
        const mockResponse = {
            students: ['testid', 'otherid'],
            teachers: ['teacherid']
        } as UsersOfClass;

        /* eslint-disable  @typescript-eslint/no-explicit-any */
        http.get.and.callFake((url: string): Observable<any> => {
            if (url.includes(`/classes/${id}/users`)) {
                return of(mockResponse);
            }
            return of(null);
        });

        service.usersInClass(id).subscribe((response) => {
            expect(response.students.length).toBe(2);
            expect(response.teachers.length).toBe(1);
            expect(response.students).toEqual(mockResponse.students);
        });

    });

    it('should respond class with id', () => {
        http.get.and.returnValue(of(_class));

        service.classWithId('123').subscribe((response: Class) => {
            expect(response).toEqual(_class);
        });
    });

    it('should create a class', () => {
        http.post.and.returnValue(of(_newClassResponse));

        service.createClass(_class).subscribe((response: string) => {
            expect(response).toEqual(id);
        });
    });

    it('should delete a class', () => {
        http.delete.and.returnValue(of({ status: 204 }));

        service.deleteClass(id).subscribe((response: boolean) => {
            expect(response).toBeTrue();
        });
    });

    it('should update a class', () => {
        http.patch.and.returnValue(of({ status: 204 }));

        service.updateClass(_class).subscribe((response: boolean) => {
            expect(response).toBeTrue();
        });
    });

});
