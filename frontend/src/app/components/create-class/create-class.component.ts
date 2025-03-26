import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClassesService } from '../../services/classes.service';
import { NewClass } from '../../interfaces/classes/newClass';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-create-class',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './create-class.component.html',
  styleUrl: './create-class.component.less'
})
export class CreateClassComponent {

  createForm: FormGroup;
  
  public constructor(
    private formBuilder: FormBuilder,
    private classesService: ClassesService
  ) {
    this.createForm = this.buildCreateForm();
  }

  public create() {
    const idObservable: Observable<string> = this.classesService.createClass(
      this.extractCreateFormValues()
    );

    idObservable.pipe().subscribe((response) => {
      if(response) {
        window.alert("Succes!");
      }
    });
  }

  private extractCreateFormValues(): NewClass {
    return {
      name: this.createForm.value.name,
      description: this.createForm.value.description,
      targetAudience: this.createForm.value.targetAudience
    }
  }

  private buildCreateForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      targetAudience: ['', Validators.required]
    });
  }

}
