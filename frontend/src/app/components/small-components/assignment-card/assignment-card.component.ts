import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatRippleModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { AssignmentService } from "../../../services/assignment.service";
import { Assignment } from "../../../interfaces/assignment";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AuthenticationService } from "../../../services/authentication.service";
import { UserType } from "../../../interfaces";

@Component({
    selector: 'app-assignment-card',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatCardModule, MatRippleModule, MatButtonModule, MatTooltipModule, MatIcon],
    templateUrl: './assignment-card.component.html',
    styleUrls: ['./assignment-card.component.less']
})
export class AssignmentCardComponent implements OnInit {
    @Input() assignment!: Assignment;
    @Input() disabled: boolean = false;

    @Output() clicked = new EventEmitter<string>()

    isTeacher: boolean = false;

    private readonly snackBar = inject(MatSnackBar);

    constructor(
        private assignmentService: AssignmentService,
        private authService: AuthenticationService,
    ) { }

    ngOnInit(): void {
        this.isTeacher = this.authService.retrieveUserType() === UserType.TEACHER;
    }

    onClick() {
        this.clicked.emit(this.assignment.id);
    }

    onDelete() {
        this.assignmentService.deleteAssignment(this.assignment).subscribe(
            (deleted) => {
                if (deleted) {
                    window.location.reload();
                }
                else {
                    this.openSnackBar($localize`error whilst deleting`);
                }
            }
        )
    }

    private openSnackBar(message: string, action: string = "Ok") {
        this.snackBar.open(message, action, {
            duration: 2500
        });
    }

}
