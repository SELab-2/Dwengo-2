import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { UserRegistration } from '../../interfaces';
import { UserType } from '../../interfaces/user/user';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    
    // Angular material
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.less'
})
export class RegisterComponent {
  registrationForm: FormGroup;

  private _passwordVisible = false;

  constructor(
    private formBuilder: FormBuilder, 
    private authenticationService: AuthenticationService,
  ) {
    this.registrationForm = this.buildRegistrationForm();
  }

  get passwordVisible() {
    return this._passwordVisible;
  }

  public togglePasswordVisibility() {
    this._passwordVisible = !this._passwordVisible;
  }

  public register() {
    const valid = this.registrationForm.valid;
    const validPassword = this.registrationForm.value.password === this.registrationForm.value.confirmPassword;
    if (valid && validPassword) {
      const registrationData = this.extractRegistrationFormValues();
      this.sendRegisterData(registrationData);
    }
  }

  private sendRegisterData(registrationData: UserRegistration) {
    this.authenticationService.register(registrationData);
  }

  private extractRegistrationFormValues(): UserRegistration {
    return {
      email: this.registrationForm.value.email,
      firstName: this.registrationForm.value.firstName,
      familyName: this.registrationForm.value.lastName,
      schoolName: this.registrationForm.value.school,
      password: this.registrationForm.value.password,
      userType: this.registrationForm.value.teacher ? UserType.TEACHER : UserType.STUDENT
    };
  }

  private buildRegistrationForm(): FormGroup {
    return this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      school: ['', Validators.required],
      teacher: [false]
    });
  }
}
