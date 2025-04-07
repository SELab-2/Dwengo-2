import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "./authentication.service";
import { ErrorService } from "./error.service";
import { of } from "rxjs";
import { User, UserType } from "../interfaces";
import { UserService } from "./user.service";

describe('UserService', () => {

    let http: jasmine.SpyObj<HttpClient>;
    let authService: jasmine.SpyObj<AuthenticationService>;
    let errorService: jasmine.SpyObj<ErrorService>;
    let service: UserService;

    let fakeUser: User;

    beforeEach(() => {
        http = jasmine.createSpyObj('HttpClient', ['get']);
        authService = jasmine.createSpyObj('AuthenticationService', ['retrieveUserId', 'retrieveToken', 'retrieveUserType']);
        errorService = jasmine.createSpyObj('ErrorService', ['pipeHandler']);

        // Mock the return values of the AuthenticationService methods
        authService.retrieveUserId.and.returnValue("mockUserId");
        authService.retrieveToken.and.returnValue("mockToken");
        authService.retrieveUserType.and.returnValue(UserType.TEACHER);
        errorService.pipeHandler.and.callFake(() => (source) => source);

        // Mock user
        fakeUser = {
            id: 'mockUserId',
            email: 'mockEmail',
            firstName: 'mockFirstName',
            familyName: 'mockLastName',
            schoolName: 'mockSchoolName',
            passwordHash: 'mockPasswordHash',
        };

        service = new UserService(http, authService, errorService);
    });

    it('should call userWithId and return user data', () => {
        http.get.and.returnValue(of(fakeUser));

        service.userWithId('mockUserId').subscribe(user => {
            expect(user).toEqual(fakeUser);
        });
    });
    
});
