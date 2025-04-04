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
          this.storeToken(response.token);
          this.storeUserId(response.id);
          this.storeUserType(userType);
          this.router.navigateByUrl(url);
        }

      });
  }

  logout(): void {
    this.removeToken();
    this.removeUserId();
    this.removeUserType();
    
    console.log('Logged out');

    this.router.navigateByUrl('/');
  }

  storeToken = (token: string): void => localStorage.setItem('AuthenticationToken', token);
  retrieveToken = (): string | null => localStorage.getItem('AuthenticationToken');
  removeToken = (): void => localStorage.removeItem('AuthenticationToken');

  storeRefreshToken = (refreshToken: string): void => localStorage.setItem('RefreshToken', refreshToken);
  retrieveRefreshToken = (): string | null => localStorage.getItem('RefreshToken');
  removeRefreshToken = (): void => localStorage.removeItem('RefreshToken');

  storeUserId = (userId: string): void => localStorage.setItem('UserId', userId);
  retrieveUserId = (): string | null => localStorage.getItem('UserId');
  removeUserId = (): void => localStorage.removeItem('UserId');

  storeUserType = (userType: UserType): void => localStorage.setItem('UserType', userType);
  retrieveUserType = (): UserType | null => localStorage.getItem('UserType') as UserType;
  removeUserType = (): void => localStorage.removeItem('UserType');

}
