import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Submission, SubmissionStatus } from '../../interfaces/submissions';
import { UserService } from '../../services/user.service';
import { forkJoin } from 'rxjs';
import { MultipleChoiceTask, NormalQuestionTask, Task, TaskType } from '../../interfaces/tasks';
import { SubmissionService } from '../../services/submission.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface SubmissionWithName extends Submission {
    name: string,
}

@Component({
    selector: 'app-assignment-stats',
    imports: [MatButtonModule,
        MatIcon,
        FormsModule,
        MatButtonModule,
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

    @Output() patched = new EventEmitter<void>();

    private snackBar = inject(MatSnackBar);

    public ready: boolean = false;
    public type!: string;
    public answer: string = "";
    public correctAnswers: string = "";

    public fullSubmission: SubmissionWithName[] = [];

    public patchSucceeded = $localize`Submission updated!`;
    public patchFailed = $localize`Submission update failed!`;

    constructor(
        private userService: UserService,
        private submissionService: SubmissionService,
    ) { }

    parseNumberList(input: string): number[] {
        return input
            .split(/[\s,;]+/)           // split on stuff
            .map(s => parseFloat(s))    // try parse
            .filter(n => !isNaN(n));    // filter rubbish
    }

    ngOnInit(): void {
        if (!this.task || this.task.type === TaskType.Other) {
            this.type = 'empty';
            return
        }
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
                // Also retrieve the answer from the task
                if (!this.task || this.task.type === TaskType.Other) {
                    this.type = 'empty';
                    return
                }
                if (this.task.type === TaskType.NORMALQUESTION && (this.task.details as NormalQuestionTask).predefined_answer) {
                    this.answer = (this.task.details as NormalQuestionTask).predefined_answer
                    this.type = 'norm'
                } else if (this.task.type === TaskType.MULTIPLECHOICE) {
                    this.correctAnswers = (this.task.details as MultipleChoiceTask).correctAnswers.map(i => (this.task!.details as MultipleChoiceTask).options[i]).toString()
                    this.fullSubmission = this.fullSubmission.map(submission => {
                        const nums = this.parseNumberList(submission.contents)
                        const c = nums.map(
                            answer => (this.task!.details as MultipleChoiceTask).options[answer]
                        ).toString();
                        return ({
                            ...submission,
                            contents: c,
                        })
                    });
                    this.type = 'mult'
                }
                this.ready = true;
            }

        );




    }

    trackBySubmission(_: number, item: SubmissionWithName): string {
        return `${item.id}-${item.status}`;
    }

    approveSubmission(submission: SubmissionWithName) {
        this.submissionService.patchSubmission({ ...submission, status: SubmissionStatus.ACCEPTED }).subscribe({
            next: () => {
                this.openSnackBar(this.patchSucceeded);
            },
            error: () => this.openSnackBar(this.patchFailed),
            complete: () => {
                this.patched.emit();
            }
        });
    }


    rejectSubmission(submission: Submission) {
        this.submissionService.patchSubmission({ ...submission, status: SubmissionStatus.NOT_ACCEPTED }).subscribe({
            next: () => {
                this.openSnackBar(this.patchSucceeded);
            },
            error: () => this.openSnackBar(this.patchFailed),
            complete: () => {
                this.patched.emit();
            }
        });
    }

    private openSnackBar(message: string, action: string = "Ok") {
        this.snackBar.open(message, action, {
            duration: 2500
        });
    }
}
