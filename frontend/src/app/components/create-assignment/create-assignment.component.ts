import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
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
import { User } from '../../interfaces';
import { CreateGroupComponent } from '../create-group/create-group.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentComponent } from '../assignment/assignment.component';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-assignment',
  imports: [
    ReactiveFormsModule,
    CreateGroupComponent,
    AssignmentComponent,

    // Angular material
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDateRangePicker,
    MatInputModule,
    MatDateRangeInput,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './create-assignment.component.html',
  styleUrl: './create-assignment.component.less',
  standalone: true
})
export class CreateAssignmentComponent implements OnInit {

  @Output() showGroups: EventEmitter<void> = new EventEmitter<void>

  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  public learningPathId: string = "";
  public language: string = "nl";

  public createForm: FormGroup;

  public classes: Class[] = [];
  public paths: LearningPath[] = [];

  public initializeTasks: boolean = false; // Initialize tasks after group creation
  public showCreateGroup: boolean = false;
  public assignmentId: string = '';
  public classMembers: User[] = [];

  public enableCreate: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private classesService: ClassesService,
    private learningPathService: LearningPathService,
    private assignmentService: AssignmentService,
    private taskService: TaskService,
    private router: Router,
  ) {
    this.createForm = this.buildCreateForm();
  }

  ngOnInit(): void {
    this.route.url.subscribe((segment) => {
      this.learningPathId = segment[2].path ? segment[2].path : "";
      this.language = segment[3].path ? segment[3].path : "nl";
    });
    this.createForm = this.buildCreateForm();
    this.getClasses();
    this.getLearningPaths();

  }

  checkNonEmpty(classId: string) {
    this.classesService.usersInClass(classId).subscribe(
      value => this.enableCreate = value.students.length > 0
    )
  }

  create(): void {
    const newAssignment: NewAssignment | null = this.extractFormValues();
    if (newAssignment) {
      this.assignmentService.createAssignment(newAssignment).subscribe((response) => {

        // Prepare making the groups for this class
        this.classesService.classStudents(newAssignment.classId).subscribe((students) => {
          this.classMembers = students;
          this.assignmentId = response.id;
          this.showGroups.emit();
          this.showCreateGroup = true;
        });
      });
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
      startDate: [new Date(), Validators.required],
      deadline: [new Date(), Validators.required],
      extraInstructions: ['', Validators.minLength(10)],
    });
  }

  private extractFormValues(): NewAssignment | null {
    const name = this.createForm.get('name')?.value;
    const classId = this.createForm.get('classId')?.value;
    const startDate = this.createForm.get('startDate')?.value;
    const deadline = this.createForm.get('deadline')?.value;
    const extraInstructions = this.createForm.get('extraInstructions')?.value;

    if (classId && startDate && deadline) {
      // Make this safe date so converting to UTC doesn't change the day
      // This can be done in a beter way and should be done in the future, but for now this fix works
      const safeStart = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      12, 0, 0
    );

    const safeDeadline = new Date(
      deadline.getFullYear(),
      deadline.getMonth(),
      deadline.getDate(),
      12, 0, 0
    );
      return {
        classId,
        learningPathId: this.learningPathId,
        startDate: safeStart,
        deadline: safeDeadline,
        extraInstructions,
        name
      };
    }

    return null;
  }

  groupsCreated() {
    this.initializeTasks = true;
  }

  tasksInitialized() {
    // Initialize all empty tasks with an 'other'-type task without details
    this.taskService.fillRestWithEmptyTasks(this.assignmentId).subscribe({
      next: () => {
        this.snackBar.open($localize`Assignment Created!`);
      },
      error: () => {
        this.snackBar.open($localize`Something went wrong!`);
      }
    });



    // we can redirect to assignments page
    this.router.navigate(['/teacher/assignments']);
  }

}
