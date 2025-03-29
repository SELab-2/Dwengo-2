import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Class } from '../../interfaces/classes/class';
import { ClassesService } from '../../services/classes.service';
import { LoadingComponent } from '../loading/loading.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


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

  private readonly route = inject(ActivatedRoute);

  _class?: Class;

  editing: boolean = false;

  updateForm: FormGroup;

  public constructor(
    private formBuilder: FormBuilder,
    private classesService: ClassesService
  ) {
    this.updateForm = this.buildUpdateForm();
  }

  public ngOnInit() {
    const id: string | null = this.route.snapshot.paramMap.get('id');

    if(id) {
      const classObservable = this.classesService.classWithId(id);

      classObservable.pipe().subscribe(
        (response) => {
          if(response) {
            this._class = response;

            // TODO: clean this
            this.updateForm.setValue({
              name: response.name,
              description: response.description,
              targetAudience: response.targetAudience
            });
          };
        }
      );
    } else {
      window.alert('Unable to retrieve id from this route');
    }
  }

  public delete() {
    const delClassObservable = this.classesService.deleteClass(this._class!.classId);

    delClassObservable.pipe().subscribe(
      (response) => {
        if(response) window.alert('Class deleted succesfully!');
        // TODO: redirect to class overview
      }
    );
  }

  public startEdit() {
    this.editing = true;
  }

  public cancelEdit() {
    this.editing = false;
  }

  public saveEdit() {
    const newClass = this.extractUpdateFormValues();
    window.alert(newClass.name);
    const updateClassObservable = this.classesService.updateClass(newClass);

    updateClassObservable.pipe().subscribe(
      (response) => {
        if(response) {
          // window.alert('Class updated succesfully!');
          window.alert(response.name);
          this._class = response;
        }
      }
    );

    this.editing = false;
  }

  private extractUpdateFormValues(): Class {
    return {
      name: this.updateForm.value.name,
      description: this.updateForm.value.description,
      targetAudience: this.updateForm.value.targetAudience,
      classId: this._class!.classId,
      teacherId: this._class!.teacherId
    };
  }

  private buildUpdateForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      targetAudience: ['', Validators.required]
    });
  }

}
