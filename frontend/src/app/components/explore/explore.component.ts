import { Component } from '@angular/core';
import { LearningPathInfoCardComponent } from '../small-components/learning-path-info-card/learning-path-info-card.component';

@Component({
    selector: 'app-explore',
    standalone: true,
    imports: [LearningPathInfoCardComponent],
    templateUrl: './explore.component.html',
    styleUrl: './explore.component.less'
})
export class ExploreComponent {
    learningPath: { title: string, description: string, steps: number, minAge: number, maxAge: number, learningPathId: string } = {
        title: 'Learning Path 1',
        description: 'Description for Learning Path 1',
        steps: 5,
        minAge: 10,
        maxAge: 15,
        learningPathId: '1'
    };
    learningPaths = [
        {
            title: 'Learning Path 1',
            description: 'Description for Learning Path 1',
            steps: 5,
            minAge: 10,
            maxAge: 15,
            learningPathId: '1'
        },
        {
            title: 'Learning Path 2',
            description: 'Description for Learning Path 2',
            steps: 3,
            minAge: 8,
            maxAge: 12,
            learningPathId: '2'
        },
        {
            title: 'Learning Path 3',
            description: 'Description for Learning Path 3',
            steps: 4,
            minAge: 12,
            maxAge: 16,
            learningPathId: '3'
        },
    ]
}
