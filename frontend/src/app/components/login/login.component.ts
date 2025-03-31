import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { UserLoginCredentials, UserType } from '../../interfaces';
import { catchError, of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoginResponse } from '../../interfaces/authentication/login-response';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent {
  loginForm: FormGroup;
  userType = input('userType');

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) {
    this.loginForm = this.buildLoginForm();
  }

  login() {
    if(this.loginForm.valid) {
      const loginData = this.extractLoginFormValues();
      this.sendLoginData(loginData);
    } else {
      window.alert('Please fill in all required fields correctly.');
    }
  }

  private sendLoginData(loginData: UserLoginCredentials) {
    const observable = this.authenticationService.login(loginData);
    this.pipeLoginResponse(observable);
  }

  private pipeLoginResponse(observable: Observable<LoginResponse>) {
    observable.pipe(
      catchError((error) => {
        window.alert(`Login failed: ${error.message}`);
        return of(null);
      }))
      .subscribe((_) => {
        let url: string;

        if (this.userType() === UserType.STUDENT) {
          url = 'student/dashboard'
        } else if (this.userType() === UserType.TEACHER) {
          url = 'teacher/dashboard'
        } else {
          url = 'placeholder'
        }

        this.router.navigateByUrl(url)
      });
  }

  private extractLoginFormValues(): UserLoginCredentials {
    return {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }
  }

  private buildLoginForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
}
