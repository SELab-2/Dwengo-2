import { Component, Input, Inject, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { Assignment } from '../../../interfaces/assignments/assignment';

@Component({
    selector: 'app-deadlines-widget',
    standalone: true,
    imports: [CommonModule, MatCardModule, RouterModule],
    providers: [DatePipe], // Inject DatePipe
    templateUrl: './deadlines-widget.component.html',
    styleUrls: ['./deadlines-widget.component.less']
})
export class DeadlinesWidgetComponent {
    @Input() assignments: Assignment[] = [];

    constructor(private datePipe: DatePipe, @Inject(LOCALE_ID) private locale: string) { }

    getSortedAssignments() {
        return this.assignments
            .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    }

    formatDate(date: Date): string {
        // dynamic localization, angular/localize only allows static
        return this.datePipe.transform(date, 'dd MMM yyyy', undefined, this.locale) ?? 'Invalid date';
    }
}
