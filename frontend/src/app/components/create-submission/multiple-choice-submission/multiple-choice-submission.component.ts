import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MultipleChoice } from '../../../interfaces/assignment/tasks';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatList } from '@angular/material/list';
@Component({
  selector: 'app-multiple-choice-submission',
  imports: [MatButtonModule, MatIcon, FormsModule, MatFormFieldModule, MatInputModule, MatCardModule, MatCheckbox, MatList],
  templateUrl: './multiple-choice-submission.component.html',
  styleUrl: './multiple-choice-submission.component.less'
})
export class MultipleChoiceSubmissionComponent {
  @Input() choiceObject!: MultipleChoice;
  isTeacher: boolean = false;

  @Output() submissionCreated: EventEmitter<MultipleChoice> = new EventEmitter<MultipleChoice>();

  update(checked: boolean, idx: number) {
    if (!checked) {
      // Box goes from true to false: get it out of our list
      this.choiceObject.selected.splice(this.choiceObject.selected.indexOf(idx), 1)
    } else {
      // Now we know we can simply add the index
      this.choiceObject.selected.push(idx);
    }
  }

  submitAnswer() {
    // Pass the object trough
    this.submissionCreated.emit(
      this.choiceObject
    );
  }

}
