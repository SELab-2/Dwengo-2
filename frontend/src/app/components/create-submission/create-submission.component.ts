import {
  Component, EventEmitter, inject, Input, Output,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  OnInit
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubmissionService } from '../../services/submission.service';
import { NewSubmission } from '../../interfaces/submissions/newSubmission';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserType } from '../../interfaces';
import { AssignmentTask, MultipleChoice, NormalQuestion } from '../../interfaces/assignment/tasks';
import { MultipleChoiceSubmissionComponent } from './multiple-choice-submission/multiple-choice-submission.component';
import { NormalTaskSubmissionComponent } from './normal-task-submission/normal-task-submission.component';
import { TaskType } from '../../interfaces/tasks';
@Component({
  selector: 'app-create-submission',
  imports: [MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, MatCardModule],
  templateUrl: './create-submission.component.html',
  styleUrl: './create-submission.component.less'
})
export class CreateSubmissionComponent implements OnInit {
  // We want to generate the submission container based on the kind of submission we can make (if we can make any)
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  @Input() assignmentId!: string;
  @Input() learningObjectId!: string;
  @Input() taskObject!: AssignmentTask;
  @Input() type!: TaskType;

  // Content of the input field
  public answer: string = '';


  // Emit an event when the submission is created
  @Output() submissionCreated: EventEmitter<void> = new EventEmitter<void>();
  private readonly snackBar = inject(MatSnackBar);
  private readonly errorMessage = $localize`An error occured, please try again.`;
  private readonly createSuccesMessage = $localize`Submission created succesfully!`;

  constructor(private submissionService: SubmissionService, private authService: AuthenticationService) { }

  public ngOnInit(): void {
    console.log("called", this.type)
    if (this.type === TaskType.MULTIPLECHOICE) {
      this.loadMultipleChoice(this.taskObject as MultipleChoice);
    }
    if (this.type === TaskType.NORMALQUESTION) {
      this.loadNormalTask(this.taskObject as NormalQuestion);
    }
  }

  /**
     * Create a submission
     * Make a request to the API to create a submission
     * Notify the user of the result
     */
  public create() {
    if (this.authService.retrieveUserType() === UserType.TEACHER) {
      this.submissionCreated.emit();
    } else {
      // Create a new submission
      const newSubmission: NewSubmission = {
        studentId: this.authService.retrieveUserId()!,
        assignmentId: this.assignmentId,
        learningObjectId: this.learningObjectId,
        contents: this.answer,
        time: new Date()
      }
      if (newSubmission) {
        const idObservable: Observable<string> = this.submissionService.createSubmission(
          newSubmission
        );

        idObservable.pipe().subscribe(() => {
          this.openSnackBar(this.createSuccesMessage);
          // Emit the event that submission was created
          this.submissionCreated.emit();
          // Clear form field
          this.answer = "";
        });
      } else {
        this.openSnackBar(this.errorMessage);
      }
    }
  }

  public onSubmissionCreated(obj: AssignmentTask): void {
    // Implement logic to submit the answer based on the type of question
    console.log(obj);
  }

  loadMultipleChoice(choiceObject: MultipleChoice) {
    this.container.clear();

    if (this.type === TaskType.MULTIPLECHOICE) {
      const componentRef: ComponentRef<MultipleChoiceSubmissionComponent> =
        this.container.createComponent(MultipleChoiceSubmissionComponent);

      componentRef.instance.choiceObject = choiceObject;
      componentRef.instance.submissionCreated.subscribe((event: AssignmentTask) => {
        this.onSubmissionCreated(event);
      });
    }
  }

  loadNormalTask(testObject: NormalQuestion) {
    console.log(testObject)
    this.container.clear();

    if (this.type === TaskType.NORMALQUESTION) {
      const componentRef: ComponentRef<NormalTaskSubmissionComponent> =
        this.container.createComponent(NormalTaskSubmissionComponent);

      componentRef.instance.taskObject = testObject;
      componentRef.instance.submissionCreated.subscribe((event: AssignmentTask) => {
        this.onSubmissionCreated(event);
      });
    }
  }
  private openSnackBar(message: string, action: string = "Ok") {
    this.snackBar.open(message, action, {
      duration: 2500
    });
  }
}
