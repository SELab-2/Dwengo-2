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
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskType } from '../../../interfaces/tasks';
@Component({
  selector: 'app-create-multiple-choice',
  imports: [MatButtonModule, MatIcon, FormsModule, MatFormFieldModule, MatInputModule, MatCardModule, ReactiveFormsModule, MatListItem, MatList, MatCheckbox, MatTooltipModule],
  templateUrl: './create-multiple-choice.component.html',
  styleUrl: './create-multiple-choice.component.less'
})
export class CreateMultipleChoiceComponent {

  title = new FormControl('')
  newOption = new FormControl('')
  allowMultipleOptions: boolean = false;
  options: string[] = [];
  correctAnswers: boolean[] = [];
  edit: boolean = true;

  constructor() { }
  @Output() taskCreated: EventEmitter<MultipleChoice> = new EventEmitter<MultipleChoice>();

  addOption(): void {
    const val = this.newOption.value;
    if (val !== null) {
      const trimmed = val.trim();
      if (trimmed) {
        this.options.push(trimmed);
        this.correctAnswers.push(true);
        this.newOption.setValue('');
      }
    }
  }

  deleteOption(idx: number) {
    this.options.splice(idx, 1);
    this.correctAnswers.splice(idx, 1);
  }

  selectCorrect(idx: number) {
    this.correctAnswers[idx] = true;
  }
  selectIncorrect(idx: number) {
    this.correctAnswers[idx] = false;
  }

  update(change: boolean): void {
    this.allowMultipleOptions = change;

  }

  ready() {
    this.edit = false;
    this.title.disable();
  }
  setEdit() {
    this.edit = true;
    this.title.enable();
  }

  submitQuestion(): void {
    // This one does not make any calls, it just returns the multiple-choice object
    const l = this.correctAnswers.map((b, i) => {
      if (b) return i;
      return null;
    });
    const obj = {
      question: this.title.value,
      allowMultipleAnswers: this.allowMultipleOptions,
      options: this.options,
      selected: [],
      correctAnswers: l.filter(o => Number.isInteger(o)),
      type: TaskType.MULTIPLECHOICE,
    } as MultipleChoice;
    this.taskCreated.emit(obj)
  }
}
