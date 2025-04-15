import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { LearningPath } from '../../interfaces/learning-path';
import { LearningPathList } from '../small-components/learning-path-list/learning-path-list.component';

@Component({
    selector: 'app-explore',
    standalone: true,
    imports: [LearningPathList],
    templateUrl: './explore.component.html',
    styleUrl: './explore.component.less'
})
export class ExploreComponent implements OnInit {
    @Input() isTeacher: boolean = false;
    constructor(public authService: AuthenticationService) { }

    ngOnInit(): void {
        this.isTeacher = this.authService.retrieveUserType() === "teacher";
    }


    learningPath: LearningPath = {
        title: 'Learning Path 1',
        description: 'Description for Learning Path 1',
        steps: 5,
        minAge: 10,
        maxAge: 15,
        learningPathId: '1'
    };
    learningPaths: LearningPath[] = [
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
