import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NormalQuestion } from '../../../interfaces/assignment/tasks';
@Component({
  selector: 'app-normal-task-submission',
  imports: [MatButtonModule, MatIcon, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCardModule],
  templateUrl: './normal-task-submission.component.html',
  styleUrl: './normal-task-submission.component.less'
})
export class NormalTaskSubmissionComponent {
  @Input() taskObject!: NormalQuestion;

  answer = new FormControl('')

  constructor() { }

  @Output() submissionCreated: EventEmitter<NormalQuestion> = new EventEmitter<NormalQuestion>();

  submitAnswer() {
    // Pass the object trough
    this.submissionCreated.emit(
      { ...this.taskObject, answer: this.answer.value }
    );
  }

}
