import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { LearningPath } from '../../../interfaces/learning-path/learningPath';
import { LearningPathInfoCardComponent } from '../learning-path-info-card/learning-path-info-card.component';

@Component({
    selector: 'app-learning-path-list',
    standalone: true,
    imports: [CommonModule, MatCardModule, LearningPathInfoCardComponent],
    templateUrl: './learning-path-list.component.html',
    styleUrls: ['./learning-path-list.component.less']
})
export class LearningPathListComponent {
    @Input() learningPaths: LearningPath[] = [];
    @Input() isTeacher: boolean = false;
    @Input() title: string = 'Learning Paths';

    @Output() showPopup: EventEmitter<LearningPath> = new EventEmitter<LearningPath>();

    emit(path: LearningPath): void {
        this.showPopup.emit(path);
    }
}
