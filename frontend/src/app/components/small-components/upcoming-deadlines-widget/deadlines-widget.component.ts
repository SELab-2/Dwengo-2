import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-deadlines-widget',
    standalone: true,
    imports: [CommonModule, MatCardModule, RouterModule],
    templateUrl: './deadlines-widget.component.html',
    styleUrls: ['./deadlines-widget.component.less']
})
export class DeadlinesWidgetComponent {
    @Input() assignments: { deadline: Date, name?: string, id: string, className?: string }[] = [];

    getSortedAssignments() {
        return this.assignments
            .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()); // Sorteer op datum
    }

    // TODO: i18n
    formatDate(date: Date): string {
        return new Intl.DateTimeFormat('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
    }
}
