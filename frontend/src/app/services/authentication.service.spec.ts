import { of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "./authentication.service";
import { LoginResponse, RegisterResponse, UserLoginCredentials, UserRegistration, UserType } from "../interfaces";
import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";
import { ErrorService } from "./error.service";
import { ErrorAuthHandlerService } from "./errorAuthHandler.service";

describe('AuthenticationService', () => {
  let router: Router;
  let http: jasmine.SpyObj<HttpClient>;
  let service: AuthenticationService;
  let errorService: jasmine.SpyObj<ErrorService>;
  let errorAuthHandlerService: jasmine.SpyObj<ErrorAuthHandlerService>;

  const email: string = "baldur@asgard.no";
  const password: string = "Thor sucks";
  const token: string = "I am the one true god";

  const userDetails: UserRegistration = {
    email: email,
    firstName: "Baldur",
    familyName: "Odinsson",
    schoolName: "Asgard High",
    password: password,
    userType: UserType.STUDENT
  }

  const registrationResponse: RegisterResponse = {
    id: "hehehe",
  }

  const loginCredentials: UserLoginCredentials = {
    email: email,
    password: password
  }

  const loginResponse: LoginResponse = {
    token: token,
    id: "123456",
    message: "hehehe",
    refreshToken: token,
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideRouter([]), // This provides a test router
        { provide: HttpClient, useValue: jasmine.createSpyObj('HttpClient', ['post']) }
      ]
    });

    errorService = jasmine.createSpyObj('ErrorService', ['pipeHandler', 'subscribeHandler']);
    errorAuthHandlerService = jasmine.createSpyObj('ErrorAuthHandlerService', ['register']);

    // Mock return values
    errorService.pipeHandler.and.callFake(() => (source) => source);

    http = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    router = TestBed.inject(Router);
    service = new AuthenticationService(router, http, errorService, errorAuthHandlerService);
  });

  it('should register', () => {
    http.post.and.returnValue(of(registrationResponse));
    expect(() => service.register(userDetails)).not.toThrow();
  });

  it('should login', () => {
    http.post.and.returnValue(of(loginResponse));
    expect(() => service.login(loginCredentials, userDetails.userType)).not.toThrow();
  });

  it('should store, retrieve and remove token', () => {
    service.storeToken(token);
    expect(service.retrieveToken()).toEqual(token);

    service.removeToken();
    expect(service.retrieveToken()).toBeNull();
  });

  it('should store, retrieve and remove id', () => {
    service.storeUserId(loginResponse.id);
    expect(service.retrieveUserId()).toEqual(loginResponse.id);

    service.removeUserId();
    expect(service.retrieveUserId()).toBeNull();
  });

  it('should retrieve the correct user credentials', () => {
    service.storeUserId(loginResponse.id);
    service.storeToken(token);
    service.storeUserType(userDetails.userType);

    expect(service.retrieveUserId()).toEqual(loginResponse.id);
    expect(service.retrieveToken()).toEqual(token);
    expect(service.retrieveUserType()).toEqual(userDetails.userType);

    expect(service.retrieveUserCredentials()).toEqual({
      userId: loginResponse.id,
      token: token
    });
  });

  it('should retrieve the correct authentication headers', () => {
    service.storeToken(token);

    const headers = service.retrieveAuthenticationHeaders();

    expect(headers.headers.get('Authorization')).toEqual(`Bearer ${token}`);
    expect(headers.headers.get('Content-Type')).toEqual('application/json');
  });

  it('should refresh token and navigate to correct dashboard', () => {
    http.post.and.returnValue(of(loginResponse));
    service.storeRefreshToken(token);
    service.storeUserType(userDetails.userType);
    spyOn(router, 'navigateByUrl');

    service.refresh();

    expect(http.post).toHaveBeenCalledWith(
        `${service['apiUrl']}/login`,
        { refreshToken: token }
    );
    expect(service.retrieveToken()).toEqual(token);
    expect(service.retrieveRefreshToken()).toEqual(token);
    expect(service.retrieveUserId()).toEqual(loginResponse.id);
    expect(router.navigateByUrl).toHaveBeenCalledWith('student/dashboard');
  });

  it('should not navigate if refresh response is null', () => {
    http.post.and.returnValue(of(null));
    service.storeRefreshToken(token);
    service.storeUserType(userDetails.userType);
    spyOn(router, 'navigateByUrl');

    service.refresh();

    expect(http.post).toHaveBeenCalled();
    expect(service.retrieveToken()).toBeNull();
    expect(service.retrieveUserId()).toBeNull();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
