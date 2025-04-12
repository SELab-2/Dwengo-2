import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NewJoinRequest } from '../../interfaces/join-requests/newJoinRequest';
import { AuthenticationService } from '../../services/authentication.service';
import { JoinRequestService } from '../../services/join-request.service';

@Component({
  selector: 'app-create-request',
  imports: [
    ReactiveFormsModule,

    // Angular material
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './create-request.component.html',
  styleUrl: './create-request.component.less'
})
export class CreateRequestComponent {

  // The form used to create a request
  public requestForm: FormGroup;

  public constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private joinRequestService: JoinRequestService
  ) {
    this.requestForm = this.buildRequestForm();
  }

  public create(): void {
    const classCode: string = this.extractRequestFormValues();
    const userId: string | null = this.authService.retrieveUserId();
    const userType: string | null = this.authService.retrieveUserType();

    if(userId && userType) {
      const newRequest: NewJoinRequest = {
        requester: userId,
        class: classCode,
        userType: userType
      };

      console.log(newRequest);

      this.joinRequestService
        .createRequest(newRequest)
        .subscribe(response => {
          if(response) window.alert("Request created successfully"); // TODO
        })
    } else {
      // TODO
    }
  }

  private extractRequestFormValues(): string { // TODO: type
    return this.requestForm.value.class;
  }

  private buildRequestForm(): FormGroup {
    return this.formBuilder.group({
      class: ['', Validators.required]
    });
  }

}
