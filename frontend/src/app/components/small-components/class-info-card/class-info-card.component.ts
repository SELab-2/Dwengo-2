import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
    selector: 'app-class-info-card',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, MatProgressSpinnerModule, RouterLink, LoadingComponent],
    templateUrl: './class-info-card.component.html',
    styleUrls: ['./class-info-card.component.less']
})
export class ClassInfoCardComponent {
    @Input() className!: string;
    @Input() studentCount!: number;
    @Input() assignmentCount!: number;
    @Input() targetGroup!: string;
    @Input() completionPercentage!: number;
    @Input() classId!: string;
    @Input() loadingData: boolean = true;

    getClassName(): string {
        return this.className.length > 75 ? this.className.slice(0, 75) + "..." : this.className;
    }

    getProgressColor(): string {
        if (this.completionPercentage < 30) {
            return 'progress-red';
        } else if (this.completionPercentage < 65) {
            return 'progress-orange';
        } else {
            return 'progress-green';
        }
    }

}
