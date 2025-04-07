import { Observable, of } from "rxjs";
import { Class } from "../interfaces/classes/class";
import { ClassesService } from "./classes.service";
import { HttpClient } from "@angular/common/http";
import { NewClassResponse } from "../interfaces/classes/newClassResponse";
import { ClassesReponse } from "../interfaces/classes/classesResponse";
import { AuthenticationService } from "./authentication.service";
import { ErrorService } from "./error.service";

describe('ClassesService', () => {
    let http: jasmine.SpyObj<HttpClient>;
    let authService: jasmine.SpyObj<AuthenticationService>;
    let errorService: jasmine.SpyObj<ErrorService>;
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
        authService = jasmine.createSpyObj('AuthenticationService', ['retrieveUserId', 'retrieveToken', 'retrieveUserType']);
        errorService = jasmine.createSpyObj('ErrorService', ['pipeHandler', 'subscribeHandler', 'retrieveError']);

        // Mock the return values of the AuthenticationService methods
        authService.retrieveUserId.and.returnValue(teacherId);
        authService.retrieveToken.and.returnValue(teacherToken);
        errorService.pipeHandler.and.callFake(() => (source) => source);
        errorService.retrieveError.and.returnValue("mockError");

        service = new ClassesService(http, authService, errorService);
    });

    it('should respond with classes', () => {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        http.get.and.callFake((url: string): Observable<any> => {
            if(url.includes('/users')) {
                return of(_classesResponse);
            } else if(url.includes('/classes')) {
                return of(_class);
            }
            return of(null);
        });

        service.classesOfUser().subscribe((response: Class[]) => {
            expect(response).toEqual([_class]);
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
        http.delete.and.returnValue(of({status: 204}));

        service.deleteClass(id).subscribe((response: boolean) => {
            expect(response).toBeTrue();
        });
    });

    it('should update a class', () => {
        http.patch.and.returnValue(of({status: 204}));

        service.updateClass(_class).subscribe((response: boolean) => {
            expect(response).toBeTrue();
        });
    });

});
