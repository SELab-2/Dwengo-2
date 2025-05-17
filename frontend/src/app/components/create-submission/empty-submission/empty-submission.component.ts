import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

/**
 * Component for a step where no extra task is set, the student can simply submit and continue
 */
@Component({
  selector: 'app-empty-submission-component',
  imports: [MatButtonModule, MatIcon, MatCardModule],
  templateUrl: './empty-submission.component.html',
  styleUrl: './empty-submission.component.less'
})
export class EmptySubmissionComponent {

  @Output() submissionCreated: EventEmitter<void> = new EventEmitter<void>();


  submitAnswer() {
    // Pass the object trough
    this.submissionCreated.emit();
  }

}
