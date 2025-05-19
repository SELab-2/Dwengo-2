import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { AuthenticationService } from "./authentication.service";
import { ErrorService } from "./error.service";
import { ClassCodeService } from "./class-codes.service";
import { Observable, of } from "rxjs";
import { Code } from "../interfaces/codes/code";

describe('ClassCodeService', () => {
    let http: jasmine.SpyObj<HttpClient>;
    let authService: jasmine.SpyObj<AuthenticationService>;
    let errorService: jasmine.SpyObj<ErrorService>;

    let service: ClassCodeService;

    const testClassId: string = "123456";
    const classCode: Code = {
        code: "1234",
        expired: false,
        classId: testClassId,
        createdAt: new Date()
    };

    beforeEach(() => {
        http = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete', 'patch']);
        authService = jasmine.createSpyObj('AuthenticationService', ['retrieveUserId', 'retrieveToken', 'retrieveUserType', 'retrieveAuthenticationHeaders']);
        errorService = jasmine.createSpyObj('ErrorService', ['pipeHandler']);

        // Mock the return values of the AuthenticationService methods
        authService.retrieveUserId.and.returnValue("mockUserId");
        authService.retrieveToken.and.returnValue("mockToken");
        authService.retrieveAuthenticationHeaders.and.returnValue({
            headers: new HttpHeaders()
                .append('Content-Type', 'application/json')
                .append('Authorization', 'Bearer mockToken')
        });

        // Mock error service
        errorService.pipeHandler.and.callFake(() => (source) => source);

        service = new ClassCodeService(
            http,
            authService,
            errorService
        );
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should create a class code', () => {
        http.post.and.returnValue(of(
            new HttpResponse({
                status: 201
            })
        ));

        service.createClassCode(testClassId).subscribe(response => {
            expect(response).toBeTrue();
        });
    });

    it('should expire a class code', () => {
        http.patch.and.returnValue(of(
            new HttpResponse({
                status: 204
            })
        ));

        service.expireClassCode(classCode).subscribe(response => {
            expect(response).toBeTrue();
        });
    });

    it('should delete a class code', () => {
        http.delete.and.returnValue(of(
            new HttpResponse({
                status: 204
            })
        ));

        service.deleteClassCode(classCode).subscribe(response => {
            expect(response).toBeTrue();
        });
    })

    it('should get class codes', () => {
        http.get.and.returnValue(of(
            classCode
        ));

        service.getClassCode(classCode.code).subscribe(response => {
            expect(response).toEqual(classCode);
        });
    });

    it('should get all class codes for a class', () => {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        http.get.and.callFake((url: string): Observable<any> => {
            if (url.includes('classes')) return of({ codes: [classCode.code] });
            else return of(classCode);
        })

        service.getClassCodes(testClassId).subscribe(response => {
            expect(response).toEqual([classCode]);
        });
    });
});
