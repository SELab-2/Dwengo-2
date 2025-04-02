import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import {
  RegisterResponse,
  UserRegistration,
  LoginResponse,
  UserLoginCredentials,
  UserType
} from '../interfaces';

import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly apiUrl = environment.API_URL;
  private readonly registerUrl = `${this.apiUrl}/register`;
  private readonly loginUrl = `${this.apiUrl}/login`;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  register(user: UserRegistration): void {
    this.http.post<RegisterResponse>(this.registerUrl, user).pipe(
      catchError((error) => {
        window.alert(`Registration failed: ${error.message}`);
        return of(null);
      }))
      .subscribe((response) => {
        let url: string;

        if (user.userType === UserType.STUDENT) {
          url = '/student/login';
        } else if (user.userType === UserType.TEACHER) {
          url = '/teacher/login';
        } else {
          window.alert('Huh? Weird. This is not supposed to happen.');
          url = 'placeholder';
        }

        if (response) {
          this.router.navigateByUrl(url);
        } else {
          window.alert('Registration failed. Please try again.');
        }
        
      });
  }
  
  login(credentials: UserLoginCredentials, userType: UserType): void { 
    this.http.post<LoginResponse>(this.loginUrl, credentials).pipe(
      catchError((error) => {
        window.alert(`Login failed: ${error.message}`);
        return of(null);
      }))
      .subscribe((response: LoginResponse | null) => {
        let url: string;

        if (userType === UserType.STUDENT) {
          url = 'student/classes' // TODO: change to dashboard
        } else if (userType === UserType.TEACHER) {
          url = 'teacher/classes' // TODO: change to dashboard
        } else {
          url = 'placeholder'
        }

        if (response) {
          console.log(`Login successful: ${response.message}`);
          this.storeToken(response.token);
          console.log(`Token stored: ${response.token}`);
          this.storeUserId(response.id);
          console.log(`User ID stored: ${response.id}`);
          this.storeUserType(userType);
          console.log(`User type stored: ${userType}`);
        }
        
        this.router.navigateByUrl(url);
      });
  }

  storeToken = (token: string): void => sessionStorage.setItem('AuthenticationToken', token);
  retrieveToken = (): string | null => sessionStorage.getItem('AuthenticationToken');
  removeToken = (): void => sessionStorage.removeItem('AuthenticationToken');

  storeRefreshToken = (refreshToken: string): void => sessionStorage.setItem('RefreshToken', refreshToken);
  retrieveRefreshToken = (): string | null => sessionStorage.getItem('RefreshToken');
  removeRefreshToken = (): void => sessionStorage.removeItem('RefreshToken');

  storeUserId = (userId: string): void => sessionStorage.setItem('UserId', userId);
  retrieveUserId = (): string | null => sessionStorage.getItem('UserId');
  removeUserId = (): void => sessionStorage.removeItem('UserId');

  storeUserType = (userType: UserType): void => sessionStorage.setItem('UserType', userType);
  retrieveUserType = (): UserType | null => sessionStorage.getItem('UserType') as UserType;
  removeUserType = (): void => sessionStorage.removeItem('UserType');

}
