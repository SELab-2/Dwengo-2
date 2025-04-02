import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Class } from '../../interfaces/classes/class';
import { ClassesService } from '../../services/classes.service';
import { LoadingComponent } from '../loading/loading.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-class',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    ReactiveFormsModule,

    // Angular material
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './class.component.html',
  styleUrl: './class.component.less'
})
export class ClassComponent implements OnInit {

  // The current activated route
  private readonly route = inject(ActivatedRoute);

  // Snackbar
  private readonly snackBar = inject(MatSnackBar);

  // Snackbar messages
  private readonly errorMessage = $localize `An error occured, please try again.`;
  private readonly updateSuccesMessage = $localize `Class updated succesfully!`;
  private readonly deleteSuccesMessage = $localize `Class deleted succesfully!`;
  private readonly invalidURLMessage = $localize `Invalid URL`;
  private readonly closeMessage = $localize `Close`;

  // The current class represented by this component
  public _class?: Class;

  // Whether the class is being edited
  public editing: boolean = false;

  // The form used to update the class
  public updateForm: FormGroup;

  public constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private classesService: ClassesService
  ) {
    this.updateForm = this.buildUpdateForm();
  }

  /**
   * Initialization of this component, retrieves the class id from the route.
   * If the id is found we retrieve this class from the API and fill in the fields.
   * Otherwise we alert the user that this class was not found.
   * 
   * Also see: https://stackoverflow.com/questions/35763730/difference-between-constructor-and-ngoninit
   */
  public ngOnInit() {
    const id: string | null = this.route.snapshot.paramMap.get('id');

    if(id) {
      const classObservable = this.classesService.classWithId(id);

      classObservable.pipe().subscribe(
        (response) => {
          if(response) {
            this._class = response;
            this.fillUpdateForm(response);
          };
        }
      );
    } else {
      this.openSnackBar(this.invalidURLMessage, this.closeMessage);
    }
  }

  /**
   * Delete this class based on it's id.
   * Notifies the user if this fails or succeeds.
   */
  public delete() {
    if(!this._class) {
      this.openSnackBar(this.errorMessage);
      return;
    };

    const delClassObservable = this.classesService.deleteClass(this._class.id);

    delClassObservable.subscribe({
      next: (response) => {
        if(response) {
          this.openSnackBar(this.deleteSuccesMessage);

          const teacher_or_student = 'teacher'; //true ? 'teacher' : 'student';
          this.router.navigate([`/${teacher_or_student}/classes`])
        } else {
          this.openSnackBar(this.errorMessage);
        }
      },
      error: () => this.openSnackBar(this.errorMessage)
    })
  }

  public startEdit() {
    this.editing = true;
  }

  public cancelEdit() {
    this.editing = false;
    this.fillUpdateForm(this._class!);
  }

  /**
   * Save the edit that the user made on this class.
   * Done by extracting the values from the form and sending them to the API.
   * Notifies the user if this fails or succeeds.
   */
  public saveEdit() {
    const newClass = this.extractUpdateFormValues();
    const updateClassObservable = this.classesService.updateClass(newClass);

    updateClassObservable.pipe().subscribe({
      next: (response) => {
        if(response) {
          this._class!.name = newClass.name;
          this._class!.description = newClass.description;
          this._class!.targetAudience = newClass.targetAudience;

          this.openSnackBar(this.updateSuccesMessage);
          this.editing = false;
        } else {
          this.openSnackBar(this.errorMessage);
          this.cancelEdit();
        }
      },
      error: () => this.openSnackBar(this.errorMessage)
    });
  }

  /**
   * Extract the values from the update form and return them as a Class object.
   * @returns The class object
   */
  private extractUpdateFormValues(): Class {
    return {
      name: this.updateForm.value.name,
      description: this.updateForm.value.description,
      targetAudience: this.updateForm.value.targetAudience,
      id: this._class!.id,
      teacherId: this._class!.teacherId
    };
  }

  /**
   * Build the update form on initialization of this component.
   * @returns The form group
   */
  private buildUpdateForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      targetAudience: ['', Validators.required]
    });
  }

  /**
   * Fill in the fields of the update form based on the given class.
   * @param _class The given class
   */
  private fillUpdateForm(_class: Class): void {
    this.updateForm.setValue({
      name: _class.name,
      description: _class.description,
      targetAudience: _class.targetAudience
    });
  }

  private openSnackBar(message: string, action: string="Ok") {
    this.snackBar.open(message, action, {
        duration: 2500
    });
  }

}
