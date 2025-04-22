import { Component, Input, OnInit } from "@angular/core";
import { LearningPath, SpecificLearningPathRequest } from "../../interfaces/learning-path";
import { AuthenticationService } from "../../services/authentication.service";
import { UserType } from "../../interfaces";
import { LearningObject, ShallowLearningObject } from "../../interfaces/learning-object";
import { LearningObjectService } from "../../services/learningObject.service";
import { DirectedGraph } from "../../datastructures/directed-graph";

@Component({
    selector: "app-learning-path-component",
    templateUrl: "learning-path.component.html",
    styleUrl: "learning-path.component.less",
    standalone: true,
    imports: [],
})
export class LearningPathComponent implements OnInit {
    @Input() path!: LearningPath;

    loading: boolean = true;
    isTeacher: boolean = false;
    learningObjects!: LearningObject[];

    constructor(private authService: AuthenticationService, private learningObjectService: LearningObjectService) { }

    ngOnInit(): void {
        // This boole indicates wether the logged in user is a teacher or not
        this.isTeacher = this.authService.retrieveUserType() === UserType.TEACHER;

        // Use the learning path to gather every learning object
        this.learningObjectService.retrieveObjectsForLearningPath(
            ({ hruid: this.path.hruid, language: this.path.language, includeNodes: true } as SpecificLearningPathRequest)
        ).subscribe(
            response => {
                this.learningObjects = response;
                this.loading = false;
            }
        );
    }

    /**
     * Find the start node, follow the transitions and link the full objects. The full trajectory will be a directed graph.
     */
    trajectory(directions: ShallowLearningObject[], detailedObjects: LearningObject[]): void {

    }
}