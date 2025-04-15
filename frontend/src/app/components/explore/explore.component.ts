import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { LearningPath, LearningPathRequest } from '../../interfaces/learning-path';
import { LearningPathListComponent } from '../small-components/learning-path-list/learning-path-list.component';
import { LearningPathService } from '../../services/learningPath.service';

@Component({
    selector: 'app-explore',
    standalone: true,
    imports: [LearningPathListComponent],
    templateUrl: './explore.component.html',
    styleUrl: './explore.component.less'
})
export class ExploreComponent implements OnInit {
    @Input() isTeacher: boolean = false;
    constructor(private authService: AuthenticationService, private learningPathService: LearningPathService) { }

    ngOnInit(): void {
        this.isTeacher = this.authService.retrieveUserType() === "teacher";

        const query: LearningPathRequest = { all: "robot" };
        const learningPathObservable = this.learningPathService.retrieveLearningPathsByQuery(query);

        learningPathObservable.pipe().subscribe(
            (response) => {
                this.learningPaths = response.learningPaths
            }
        );
    }


    learningPath: LearningPath = {
        title: 'Learning Path 1',
        description: 'Description for Learning Path 1',
        numNodes: 5,
        minAge: 10,
        maxAge: 15,
        learningPathId: '1'
    };
    learningPaths?: LearningPath[] = [
        {
            title: 'Learning Path 1',
            description: 'Description for Learning Path 1',
            numNodes: 5,
            minAge: 10,
            maxAge: 15,
            learningPathId: '1'
        },
        {
            title: 'Learning Path 2',
            description: 'Description for Learning Path 2',
            numNodes: 3,
            minAge: 8,
            maxAge: 12,
            learningPathId: '2'
        },
        {
            title: 'Learning Path 3',
            description: 'Description for Learning Path 3',
            numNodes: 4,
            minAge: 12,
            maxAge: 16,
            learningPathId: '3'
        },
    ]
}
