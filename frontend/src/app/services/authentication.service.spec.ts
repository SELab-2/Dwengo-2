import { of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "./authentication.service";
import { LoginResponse, RegisterResponse, UserLoginCredentials, UserRegistration, UserType } from "../interfaces";
import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";
import { ErrorService } from "./error.service";

describe('AuthenticationService', () => {
  let router: Router;
  let http: jasmine.SpyObj<HttpClient>;
  let service: AuthenticationService;
  let errorService: jasmine.SpyObj<ErrorService>;

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

    // Mock return values
    errorService.pipeHandler.and.callFake(() => (source) => source);
  
    http = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    router = TestBed.inject(Router);
    service = new AuthenticationService(router, http, errorService);
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
});
