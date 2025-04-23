import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-learning-path-filter',
    templateUrl: './learning-path-filter.component.html',
    styleUrls: ['./learning-path-filter.component.less'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule
    ]
})
export class LearningPathFilterComponent {
    filterForm: FormGroup;

    @Output() filtersApplied = new EventEmitter<{
        minAge: number | null,
        maxAge: number | null,
        language: string,
        searchTerm: string,
    }>();

    constructor(private fb: FormBuilder) {
        this.filterForm = this.fb.group({
            minAge: [null],
            maxAge: [null],
            language: [''],
            searchTerm: ['']
        });
    }

    applyFilters() {
        this.filtersApplied.emit(this.filterForm.value);
    }
}