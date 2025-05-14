import { Component, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatList, MatListItem } from '@angular/material/list';
import { MatCheckbox } from '@angular/material/checkbox';
import { MultipleChoice } from '../../../interfaces/assignment/tasks';
@Component({
  selector: 'app-create-multiple-choice',
  imports: [MatButtonModule, MatIcon, FormsModule, MatFormFieldModule, MatInputModule, MatCardModule, ReactiveFormsModule, MatListItem, MatList, MatCheckbox],
  templateUrl: './create-multiple-choice.component.html',
  styleUrl: './create-multiple-choice.component.less'
})
export class CreateMultipleChoiceComponent {

  title = new FormControl('')
  newOption = new FormControl('')
  allowMultipleOptions: boolean = false;
  options: string[] = [];

  constructor() { }
  @Output() taskCreated: EventEmitter<MultipleChoice> = new EventEmitter<MultipleChoice>();

  addOption(): void {
    const val = this.newOption.value;
    if (val !== null) {
      const trimmed = val.trim();
      if (trimmed) {
        this.options.push(trimmed);
        this.newOption.setValue('');
      }
    }
  }

  deleteOption(idx: number) {
    this.options.splice(idx, 1);

  }

  update(change: boolean): void {
    this.allowMultipleOptions = change;

  }

  submitQuestion(): void {
    // This one does not make any calls, it just returns the multiple-choice object
    const obj = {
      question: this.title.value,
      allowMultipleAnswers: this.allowMultipleOptions,
      options: this.options,
      selected: [],

    } as MultipleChoice;
    this.taskCreated.emit(obj)
  }
}
