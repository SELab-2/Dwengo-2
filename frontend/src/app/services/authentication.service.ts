import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  RegisterResponse,
  UserRegistration,
  LoginResponse,
  UserLoginCredentials
} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  login(credentials: UserLoginCredentials): Observable<LoginResponse> { 
    return this.http.post<LoginResponse>('http://localhost:3001/login', credentials);
  }

  register(user: UserRegistration): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>('http://localhost:3001/register', user);
  }
  
}
