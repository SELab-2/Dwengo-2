import { Component, Input, OnInit } from "@angular/core";
import { LearningPath, SpecificLearningPathRequest } from "../../interfaces/learning-path";
import { AuthenticationService } from "../../services/authentication.service";
import { UserType } from "../../interfaces";
import { LearningObject } from "../../interfaces/learning-object";
import { LearningObjectService } from "../../services/learningObject.service";
import { DirectedGraph, Node } from "../../datastructures/directed-graph";
import { LearningPathService } from "../../services/learningPath.service";
import { finalize, forkJoin } from "rxjs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { LoadingComponent } from "../loading/loading.component";
import { MatCardModule } from "@angular/material/card";
import { GraphBuilderService } from "../../services/graph-builder.service";

@Component({
    selector: "app-learning-path",
    templateUrl: "learning-path.component.html",
    styleUrl: "learning-path.component.less",
    standalone: true,
    imports: [MatFormFieldModule, MatSelectModule, MatOptionModule, LoadingComponent, MatCardModule],
})
export class LearningPathComponent implements OnInit {

    // The learning path this whole page is about (to be fetched)
    path!: LearningPath;

    // We get the language and hruid as Input, we need to get our learning path based on this info
    @Input() language!: string;
    @Input() hruid!: string;

    loading: boolean = true;
    isTeacher: boolean = false;
    learningObjects!: LearningObject[];

    // Trajectory based on transitions
    trajectoryGraph?: DirectedGraph<LearningObject>;
    selectedNode!: Node<LearningObject> | null;


    constructor(private authService: AuthenticationService, private learningObjectService: LearningObjectService, private learningPathService: LearningPathService, private graphBuilderService: GraphBuilderService) { }

    ngOnInit(): void {
        // This boole indicates wether the logged in user is a teacher or not
        this.isTeacher = this.authService.retrieveUserType() === UserType.TEACHER;

        // These are the observables for both required calls
        const objectObservable = this.learningObjectService.retrieveObjectsForLearningPath(
            { hruid: this.hruid, language: this.language, includeNodes: true } as SpecificLearningPathRequest
        );

        const nodesObservable = this.learningPathService.retrieveOneLearningPath(
            { hruid: this.hruid, language: this.language, includeNodes: true } as SpecificLearningPathRequest
        );

        forkJoin([objectObservable, nodesObservable]).pipe(
            finalize(() => this.loading = false)
        ).subscribe({
            next: ([objects, pathWithNodes]) => {

                // Assign both responses
                this.learningObjects = objects;
                this.path = pathWithNodes!;

                // Build trajectory when we're done
                if (this.path.nodes && this.learningObjects) {
                    this.trajectoryGraph = this.graphBuilderService.buildTrajectoryGraph(this.path.nodes, this.learningObjects);
                    this.selectedNode = this.trajectoryGraph.root;
                }
            },
            error: () => {
                // Errors are being handled within the service, but we need to turn off loading
                this.loading = false;
            }
        });
    }

    onNodeSelected(): void {
        // TODO
    }

}