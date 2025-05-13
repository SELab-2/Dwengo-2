import { Component, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatList, MatListItem } from '@angular/material/list';
import { MatCheckbox } from '@angular/material/checkbox';
import { MultipleChoice, NormalQuestion } from '../../../interfaces/assignment/tasks';
@Component({
  selector: 'app-create-normal-task',
  imports: [MatButtonModule, MatIcon, FormsModule, MatFormFieldModule, MatInputModule, MatCardModule, ReactiveFormsModule, MatListItem, MatList, MatCheckbox],
  templateUrl: './create-normal-task.component.html',
  styleUrl: './create-normal-task.component.less'
})
export class CreateNormalTaskComponent {

  title = new FormControl('')
  predefined_answer = new FormControl('')
  predefine: boolean = false;

  constructor() { }
  @Output() taskCreated: EventEmitter<NormalQuestion> = new EventEmitter<NormalQuestion>();


  submitQuestion(): void {
    // This one does not make any calls, it just returns the task object
    const obj = {
      question: this.title.value,
      predefined_answer: this.predefined_answer.value,
    } as NormalQuestion;
    this.taskCreated.emit(obj)
  }

  update(bool: boolean) {
    this.predefine = bool;
  }
}
