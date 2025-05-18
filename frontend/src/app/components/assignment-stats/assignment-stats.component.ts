import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
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
    @Input() submissions: {
        studentName: string;
        answer: string;
        type: 'open' | 'multiple-choice';
        correctAnswer?: string;
        id: string;
    }[] = [
            {
                studentName: "Anna",
                answer: "Parijs",
                type: "open",
                id: "test-1",
            },
            {
                studentName: "Celine",
                answer: "E=mc^2",
                type: "open",
                id: "test-2",

            },

            {
                studentName: "Emma",
                answer: "Ja",
                type: "open",
                id: "test-3",

            }
        ];

    ngOnInit(): void {

    }

    approveSubmission(submission: any) {
        // Logica voor goedkeuren
    }

    rejectSubmission(submission: any) {
        // Logica voor afkeuren
    }
}
