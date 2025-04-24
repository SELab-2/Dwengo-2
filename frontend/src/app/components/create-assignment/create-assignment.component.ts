import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ClassesService } from '../../services/classes.service';
import { Class } from '../../interfaces/classes/class';
import { LearningPathService } from '../../services/learningPath.service';
import { LearningPathResponse, LearningPath } from '../../interfaces/learning-path';
import { MatDatepickerModule, MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { NewAssignment } from '../../interfaces/assignment';
import { AssignmentService } from '../../services/assignment.service';

@Component({
  selector: 'app-create-assignment',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDateRangePicker,
    MatInputModule,
    MatDateRangeInput,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './create-assignment.component.html',
  styleUrl: './create-assignment.component.less',
  standalone: true
})
export class CreateAssignmentComponent implements OnInit {
  public createForm: FormGroup;

  public classes: Class[] = [];
  public paths: LearningPath[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private classesService: ClassesService,
    private learningPathService: LearningPathService,
    private assignmentService: AssignmentService
  ) {
    this.createForm = this.buildCreateForm();
  }

  ngOnInit(): void {
    this.createForm = this.buildCreateForm();
    this.getClasses();
    this.getLearningPaths();
  }

  create(): void {
    const newAssignment: NewAssignment | null = this.extractFormValues();

    console.log(`new assignment: ${JSON.stringify(newAssignment)}`);

    if (newAssignment) {
      this.assignmentService.createAssignment(newAssignment).subscribe((response) => {
        console.log(`Assignment created: ${JSON.stringify(response)}`);
      })
    }
  }

  private getClasses(): void {
    this.classesService.classesOfUser().subscribe((response: Class[]) => {
      this.classes = response;
    });
  }
  
  private getLearningPaths(): void {
    this.learningPathService.retrieveAll().subscribe((response: LearningPathResponse) => {
      this.paths = response.learningPaths;
    });
  }

  private buildCreateForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      classId: ['', Validators.required],
      learningPathId: ['', Validators.required],
      startDate: [new Date(), Validators.required],
      deadline: [new Date(), Validators.required],
      extraInstructions: ['', Validators.minLength(10)],
    });
  }

  private extractFormValues(): NewAssignment | null {
    const name = this.createForm.get('name')?.value;
    const classId = this.createForm.get('classId')?.value;
    const learningPathId = this.createForm.get('learningPathId')?.value;
    const startDate = this.createForm.get('startDate')?.value;
    const deadline = this.createForm.get('deadline')?.value;
    const extraInstructions = this.createForm.get('extraInstructions')?.value;

    if (classId && learningPathId && startDate && deadline) {
      return {
        classId,
        learningPathId: learningPathId,
        startDate,
        deadline,
        extraInstructions,
        name
      };
    }

    return null;
  }
}
