import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Submission } from '../../interfaces/submissions';
import { UserService } from '../../services/user.service';
import { forkJoin } from 'rxjs';
import { MultipleChoiceTask, NormalQuestionTask, Task, TaskType } from '../../interfaces/tasks';

interface SubmissionWithName extends Submission {
    name: string,
}

@Component({
    selector: 'app-assignment-stats',
    imports: [MatButtonModule,
        MatIcon,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        ReactiveFormsModule,
        MatTooltipModule
        , MatDividerModule],
    templateUrl: './assignment-stats.component.html',
    styleUrl: './assignment-stats.component.less'
})
export class AssignmentStatsComponent implements OnInit {

    @Input() stepTitle: string = "Test";
    @Input() submissions!: Submission[];
    @Input() task!: Task | null;

    public ready: boolean = false;
    public type!: string;
    public answer: string = "";
    public correctAnswers: string[] = [];

    public fullSubmission: SubmissionWithName[] = [];

    constructor(
        private userService: UserService
    ) { }


    ngOnInit(): void {
        // Fill in the name for every submission (we know that they all have userid)
        forkJoin(
            this.submissions.map(
                submission => this.userService.userWithId(submission.studentId)
            )
        ).subscribe(
            users => {
                users.map(
                    (user, i) => this.fullSubmission.push({ name: user.firstName, ...this.submissions[i] })
                );
                this.ready = true;
            }

        );

        // Also retrieve the answer from the task
        if (!this.task || this.task.type === TaskType.Other) {
            this.type = 'empty';
            this.ready = true;
            return
        }
        if (this.task.type === TaskType.NORMALQUESTION && (this.task.details as NormalQuestionTask).predefined_answer) {
            this.answer = (this.task.details as NormalQuestionTask).predefined_answer
            this.type = 'norm'
        } else if (this.task.type === TaskType.MULTIPLECHOICE) {
            this.correctAnswers = (this.task.details as MultipleChoiceTask).correctAnswers.map(i => (this.task!.details as MultipleChoiceTask).options[i])
            this.type = 'mult'
        }

    }

    approveSubmission(submission: Submission) {
        // TODO: fix when backend has implemented PATCH submission
    }

    rejectSubmission(submission: Submission) {
        // TODO: fix when backend has implemented PATCH submission
    }
}
