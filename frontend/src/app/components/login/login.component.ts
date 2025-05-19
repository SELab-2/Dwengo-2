import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationService } from '../../services/authentication.service';
import { UserLoginCredentials, UserType } from '../../interfaces';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, 

    // Angular material
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent {
  loginForm: FormGroup;
  userType = input<UserType>(UserType.STUDENT);

  private _passwordVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) {
    this.loginForm = this.buildLoginForm();
  }

  public get passwordVisible(): boolean {
    return this._passwordVisible;
  }

  public togglePasswordVisibility() {
    this._passwordVisible = !this._passwordVisible;
  }

  public login() {
    if(this.loginForm.valid) {
      const loginData = this.extractLoginFormValues();
      this.sendLoginData(loginData);
    }
  }

  private sendLoginData(loginData: UserLoginCredentials) {
    this.authenticationService.login(loginData, this.userType());
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
