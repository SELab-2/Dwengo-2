import { of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "./authentication.service";
import { LoginResponse, RegisterResponse, UserLoginCredentials, UserRegistration, UserType } from "../interfaces";

describe('AuthenticationService', () => {
  let http: jasmine.SpyObj<HttpClient>;
  let service: AuthenticationService;

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

  const registerResponse: RegisterResponse = {
    id: "baldur-odinsson"
  }

  const loginCredentials: UserLoginCredentials = {
    email: email, 
    password: password
  }

  const loginResponse = {
    token: token,
    userId: "baldur-odinsson",
    message: "Login successful"
  }

  beforeEach(() => {
    http = jasmine.createSpyObj('HttpClient', ['post']);    
    service = new AuthenticationService(http);
  });

  it('should register', () => {
    http.post.and.returnValue(of(registerResponse));
    
    service.register(userDetails).subscribe((response: RegisterResponse) => {
      expect(response).toEqual(registerResponse);
    });
  });

  it('should login', () => {
    http.post.and.returnValue(of(loginResponse));

    service.login(loginCredentials).subscribe((response: LoginResponse) => {
      expect(response).toEqual(loginResponse);
    });
  });

  it('should store, retrieve and remove token', () => {
    service.storeToken(token);
    expect(service.retrieveToken()).toEqual(token);

    service.removeToken();
    expect(service.retrieveToken()).toBeNull();
  });
});
