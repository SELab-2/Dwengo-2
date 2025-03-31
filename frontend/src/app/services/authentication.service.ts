import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  RegisterResponse,
  UserRegistration,
  LoginResponse,
  UserLoginCredentials
} from '../interfaces';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly apiUrl = environment.API_URL;
  private readonly registerUrl = `${this.apiUrl}/register`;
  private readonly loginUrl = `${this.apiUrl}/login`;

  constructor(private http: HttpClient) {}

  register(user: UserRegistration): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.registerUrl, user);
  }
  
  login(credentials: UserLoginCredentials): Observable<LoginResponse> { 
    return this.http.post<LoginResponse>(this.loginUrl, credentials);
  }

  storeToken = (token: string): void => sessionStorage.setItem('AuthenticationToken', token);
  retrieveToken = (): string | null => sessionStorage.getItem('AuthenticationToken');
  removeToken = (): void => sessionStorage.removeItem('AuthenticationToken');

}
