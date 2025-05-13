import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AssignmentTask, MultipleChoice } from '../../../interfaces/assignment/tasks';
import { CreateMultipleChoiceComponent } from '../create-multiple-choice/create-multiple-choice.component';
import { CreateNormalTaskComponent } from '../create-normal-task/create-normal-task.component';


enum TaskType {
  MultipleChoice = "multiple-choice",
  NormalQuestion = "normal-question",
};

@Component({
  selector: 'app-create-task',
  imports: [MatButtonModule, MatIcon, FormsModule, MatFormFieldModule, MatInputModule, MatCardModule, CreateMultipleChoiceComponent, CreateNormalTaskComponent],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.less'
})
export class CreateTaskComponent {
  selected: TaskType | undefined; // If there is one, show the kind of task the teacher wants to create
  ready: boolean = false; // This one marks when the teacher pressed "Create a Task"

  @Output() taskCreated: EventEmitter<AssignmentTask> = new EventEmitter<AssignmentTask>();

  public start(): void {
    this.ready = true;
  }

  public back(): void {
    if (this.selected === undefined) {
      this.ready = false;
    } else {
      this.selected = undefined;
    }
  }

  public select(type: string) {
    this.selected = TaskType.MultipleChoice === type ? TaskType.MultipleChoice : TaskType.NormalQuestion;
  }
  public onTaskCreated(task: AssignmentTask): void {
    // This component should just pass through the object
    this.ready = false;
    this.taskCreated.emit(task);
  }
}
