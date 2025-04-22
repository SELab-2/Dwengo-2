import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-learning-path-filter',
    templateUrl: './learning-path-filter.component.html',
    styleUrls: ['./learning-path-filter.component.less'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule
    ]
})
export class LearningPathFilterComponent {
    minAge: number | null = null;
    maxAge: number | null = null;
    language: string = '';
    searchTerm: string = '';

    @Output() filtersApplied = new EventEmitter<{
        minAge: number | null,
        maxAge: number | null,
        language: string,
        searchTerm: string,
    }>();

    applyFilters() {
        this.filtersApplied.emit({
            minAge: this.minAge,
            maxAge: this.maxAge,
            language: this.language,
            searchTerm: this.searchTerm,
        });
    }
}
