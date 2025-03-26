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
  private tokenStored = false;

  constructor(private http: HttpClient) {}

  login(credentials: UserLoginCredentials): Observable<LoginResponse> { 
    return this.http.post<LoginResponse>('http://localhost:3001/login', credentials);
  }

  register(user: UserRegistration): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>('http://localhost:3001/register', user);
  }

  storeToken(token: string): void {
    // TODO: implement this function and check if an error would be wiser
    this.tokenStored = true;
  }

  retrieveToken(): string | undefined {
    // TODO: implement this function and check if an error would be wiser
    if (this.tokenStored) {
      return '';
    }

    return undefined;
  }
  
}
