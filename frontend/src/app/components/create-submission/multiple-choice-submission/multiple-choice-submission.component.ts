import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MultipleChoice } from '../../../interfaces/assignment/tasks';
@Component({
  selector: 'app-multiple-choice-submission',
  imports: [MatButtonModule, MatIcon, FormsModule, MatFormFieldModule, MatInputModule, MatCardModule],
  templateUrl: './multiple-choice-submission.component.html',
  styleUrl: './multiple-choice-submission.component.less'
})
export class MultipleChoiceSubmissionComponent implements OnInit {
  @Input() choiceObject!: MultipleChoice;

  // Content of the input field
  optionStates: boolean[] = [];
  allowMultipleAnswers: boolean = false;

  // Emit an event when the submission is created
  private readonly snackBar = inject(MatSnackBar);
  private readonly errorMessage = $localize`An error occured, please try again.`;
  private readonly createSuccesMessage = $localize`Submission created succesfully!`;

  constructor() { }

  public ngOnInit(): void {
    this.optionStates = this.choiceObject.options.map(() => false);
  }


  onCheckboxChange(selectedIndex: number) {
    if (this.allowMultipleAnswers) {
      // Just change one box, don't care about the rest
      this.optionStates[selectedIndex] = !this.optionStates[selectedIndex];
    } else {
      // Only one selected allowed: assert this
      this.optionStates = this.optionStates.map((_, i) => i === selectedIndex);
    }
  }

  submitAnswers() {
    // Collect the selected indices
    this.optionStates.filter((bool, i) => {
      if (bool) this.choiceObject.selected.push(i)
    });
  }

  private openSnackBar(message: string, action: string = "Ok") {
    this.snackBar.open(message, action, {
      duration: 2500
    });
  }
}
