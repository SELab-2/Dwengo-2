import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { JoinRequestService } from "./join-request.service";
import { AuthenticationService } from "./authentication.service";
import { ErrorService } from "./error.service";
import { Observable, of } from "rxjs";
import { NewJoinRequest } from "../interfaces/join-requests/newJoinRequest";

describe('JoinRequestService', () => {
    let http: jasmine.SpyObj<HttpClient>;
    let authService: jasmine.SpyObj<AuthenticationService>;
    let errorService: jasmine.SpyObj<ErrorService>;

    let service: JoinRequestService;

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

        service = new JoinRequestService(
            http,
            authService,
            errorService
        );
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should create a request', () => {
        http.post.and.returnValue(of(
            new HttpResponse({
                status: 201
            })
        ));

        const newJoinRequest: NewJoinRequest = {
            requester: '123',
            code: '1234',
            userType: 'student'
        };

        service.createRequest(newJoinRequest).subscribe(response => {
            expect(response).toBeTrue();
        });
    });

    it('should reject a request', () => {
        http.delete.and.returnValue(of(
            new HttpResponse({
                status: 204
            })
        ));

        service.rejectRequest('123').subscribe(response => {
            expect(response).toBeTrue();
        });
    });

    it('should accept a request', () => {
        http.patch.and.returnValue(of(
            new HttpResponse({
                status: 204
            })
        ));

        service.acceptRequest('123').subscribe(response => {
            expect(response).toBeTrue();
        });
    });

    it('should handle status code 500 on acceptRequest as False', () => {
        http.patch.and.returnValue(of(
            new HttpResponse({
                status: 500
            })
        ));

        service.acceptRequest('123').subscribe(response => {
            expect(response).toBeFalse();
        });
    });

    it('should get join requests for a class', () => {
        // GET /classes/{classId}/requests
        const joinRequestsMockResponse = {
            requests: ['request1', 'request2']
        };

        // GET /requests/request1
        const requestMockResponse1 = {
            id: 'request1',
            requester: 'user1',
            class: 'class1',
            status: 'pending'
        };

        // GET /requests request2
        const requestMockResponse2 = {
            id: 'request2',
            requester: 'user2',
            class: 'class1',
            status: 'pending'
        };

        // HTTP requests
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        http.get.and.callFake((url: string): Observable<any> => {
            if (url.includes('classes')) return of(joinRequestsMockResponse);
            else if (url.includes('request1')) return of(requestMockResponse1);
            else if (url.includes('request2')) return of(requestMockResponse2);
            return of(null);
        });

        service.getJoinRequestsForClass('class1').subscribe(response => {
            expect(response.length).toBe(2);
            expect(response[0].id).toBe('request1');
            expect(response[1].id).toBe('request2');
            expect(response[0].requester).toBe('user1');
            expect(response[1].requester).toBe('user2');
        });
    });

});
