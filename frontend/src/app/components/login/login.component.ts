import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { UserLoginCredentials } from '../../interfaces';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent {
  loginForm: FormGroup;

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
      console.error('Invalid login form');
    }
  }

  private sendLoginData(loginData: UserLoginCredentials) {
    this.authenticationService.login(loginData).pipe(
      catchError((error) => {
        window.alert(`Login failed: ${error.message}`);
        return of(null);
      }))
      .subscribe((response) => {
        if (response) {
          this.router.navigateByUrl('/home');
        }
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
