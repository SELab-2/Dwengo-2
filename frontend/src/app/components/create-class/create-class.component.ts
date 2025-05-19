import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClassesService } from '../../services/classes.service';
import { NewClass } from '../../interfaces/classes/newClass';
import { Observable } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card'
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-create-class',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    // Angular material
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCard,
    MatCardContent
  ],
  templateUrl: './create-class.component.html',
  styleUrl: './create-class.component.less'
})
export class CreateClassComponent {

  // Snackbar
  private readonly snackBar = inject(MatSnackBar);

  // Snackbar messages
  private readonly errorMessage = $localize `:@@createClassErrorOccured:An error occured, please try again.`;
  private readonly createSuccesMessage = $localize `:@@createClassSuccesfull:Class created succesfully!`;

  // The form used to create a class
  public createForm: FormGroup;
  
  public constructor(
    private formBuilder: FormBuilder,
    private classesService: ClassesService,
    private authService: AuthenticationService
  ) {
    this.createForm = this.buildCreateForm();
  }

  /**
   * Create a class with the values from the create form
   * Make a request to the API to create a class
   * Notify the user of the result
   */
  public create() {
    const newClass: NewClass | null = this.extractCreateFormValues();

    if(newClass) {
      const idObservable: Observable<string> = this.classesService.createClass(
        newClass
      );
  
      idObservable.pipe().subscribe(() => 
        this.openSnackBar(this.createSuccesMessage)
      );

      // force a refresh of the page to show the updated list of classes
      location.reload();
    } else {
      this.openSnackBar(this.errorMessage);
    }
  }

  /**
   * Get the values from the create form
   * @returns The values from the create form as a `NewClass`
   */
  private extractCreateFormValues(): NewClass | null {
    const teacherId: string | null = this.authService.retrieveUserId();

    if(teacherId) {
      return {
        name: this.createForm.value.name,
        description: this.createForm.value.description,
        targetAudience: this.createForm.value.targetAudience,
        teacherId: teacherId
      };
    }
    return null;
  }

  /**
   * Build a form to create a class
   * @returns FormGroup to create a class
   */
  private buildCreateForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      targetAudience: ['', Validators.required]
    });
  }

  private openSnackBar(message: string, action: string="Ok") {
    this.snackBar.open(message, action, {
        duration: 2500
    });
  }

}
