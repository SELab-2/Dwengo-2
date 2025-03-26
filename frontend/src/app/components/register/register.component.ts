import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { UserRegistration } from '../../interfaces';
import { UserType } from '../../interfaces/user/user';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.less'
})
export class RegisterComponent {
  registrationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private authenticationService: AuthenticationService,
  ) {
    this.registrationForm = this.buildRegistrationForm();
  }

  register() {
    if (this.registrationForm.valid) {
      if (this.registrationForm.value.password === this.registrationForm.value.confirmPassword) {
        const registrationData = this.extractRegistrationFormValues();
        this.sendRegisterData(registrationData);
      } else {
        window.alert("Passwords don't match!");
      }
    } else {
      window.alert("Invalid registration");
    }
  }

  /**
   * Use the authentication service to send the registration data to the server.
   * 
   * This function sends the registration data through to the server
   * and handles the response.
   * 
   * @param registrationData the registration data to send to the server
   */
  private sendRegisterData(registrationData: UserRegistration) {
    this.authenticationService.register(registrationData).pipe(
      catchError((error) => {
        window.alert(`Registration failed: ${error.message}`);
        return of(null);
      }))
      .subscribe((response) => {
        if (response) {
          window.alert(`Registration successful: ${response.id}`);
        }
      });
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
