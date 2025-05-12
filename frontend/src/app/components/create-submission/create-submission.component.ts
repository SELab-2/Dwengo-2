import { Component, EventEmitter, inject, Input, Output} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubmissionService } from '../../services/submission.service';
import { NewSubmission } from '../../interfaces/submissions/newSubmission';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-create-submission',
  imports: [MatButtonModule, MatIcon, FormsModule, MatFormFieldModule, MatInputModule, MatCardModule],
  templateUrl: './create-submission.component.html',
  styleUrl: './create-submission.component.less'
})
export class CreateSubmissionComponent {
  @Input() assignmentId!: string;
  @Input() learningObjectId!: string;

  // Content of the input field
  public answer: string = "";
  
  // Emit an event when the submission is created
  @Output() submissionCreated: EventEmitter<void> = new EventEmitter<void>();
  private readonly snackBar = inject(MatSnackBar);
  private readonly errorMessage = $localize `An error occured, please try again.`;
  private readonly createSuccesMessage = $localize `Submission created succesfully!`;
  
  constructor(private submissionService: SubmissionService, private authService: AuthenticationService) {}

  /**
     * Create a submission
     * Make a request to the API to create a submission
     * Notify the user of the result
     */
    public create() {
      // Create a new submission
      const newSubmission: NewSubmission = {
        studentId: this.authService.retrieveUserId()!,
        assignmentId: this.assignmentId,
        learningObjectId: this.learningObjectId,
        contents: this.answer,
        time: new Date()
      }  
      if(newSubmission) {
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

    private openSnackBar(message: string, action: string="Ok") {
      this.snackBar.open(message, action, {
          duration: 2500
      });
    }
}
