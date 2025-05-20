import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
import { Router } from "@angular/router";
import { Progress } from "../../interfaces/progress/progress";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-learning-path",
    templateUrl: "learning-path.component.html",
    styleUrl: "learning-path.component.less",
    standalone: true,
    imports: [MatFormFieldModule, MatSelectModule, MatOptionModule, LoadingComponent, MatCardModule, MatProgressBarModule, MatButtonModule, MatIconModule],
})
export class LearningPathComponent implements OnInit {
    // The learning path this whole page is about (to be fetched)
    path!: LearningPath;

    // We get the language and hruid as Input, we need to get our learning path based on this info
    @Input() language!: string;
    @Input() hruid!: string;
    @Input() assignment: boolean = false;
    @Input() progress?: Progress;
    @Input() popup?: boolean = false; // extra back button if component is used as popup
    @Input() step: number = 0;

    // Emit an event including the new node we navigated to, used when in an assignment 
    @Output() selectedNodeChanged = new EventEmitter<Node<LearningObject>>();

    // Specific for explore page, let know when popup needs to go back
    @Output() back = new EventEmitter<void>();

    // Emit the graph when we built is, this way assignment can use it without rebuilding
    @Output() emitGraph = new EventEmitter<DirectedGraph<LearningObject>>();

    loading: boolean = true;
    isTeacher: boolean = false;
    learningObjects!: LearningObject[];

    // Trajectory based on transitions
    trajectoryGraph?: DirectedGraph<LearningObject>;
    selectedNode!: Node<LearningObject> | null;


    constructor(
        private authService: AuthenticationService,
        private learningObjectService: LearningObjectService,
        private learningPathService: LearningPathService,
        private graphBuilderService: GraphBuilderService,
        private router: Router,
    ) { }

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
                    this.emitGraph.emit(this.trajectoryGraph);
                    // Make sure every step is set
                    this.trajectoryGraph.nodes.forEach((node, i) => {
                        node.value.metadata.step = i;
                    });
                    // If there is progress, start the assignment from that node
                    if (this.progress) {
                        const learningObject: LearningObject | undefined = objects.find(
                            (o) => o.metadata.hruid === this.progress!.learningObjectId
                        )
                        if (learningObject) {
                            this.selectedNode = this.trajectoryGraph.searchNode(learningObject);
                            if (this.selectedNode) {
                                if (this.progress!.step !== this.progress!.maxStep) {
                                    this.goToNextNode()
                                }
                                return;
                            }
                        }
                    }
                    // No progress yet, begin from start of
                    this.selectedNode = this.trajectoryGraph.root;
                    // Node was changed, emit event with node
                    this.selectedNodeChanged.emit(this.selectedNode!);
                }
            },
            error: () => {
                // Errors are being handled within the service, but we need to turn off loading
                this.loading = false;
            }
        });
    }

    // Navigate to the next node
    goToNextNode(): void {
        if (!this.trajectoryGraph || !this.selectedNode) return;

        const nextNode = this.trajectoryGraph.getNeighbors(this.selectedNode.value)[0];
        if (nextNode) {
            this.selectedNode = nextNode;
            this.step = nextNode.value.metadata.step!;
            this.selectedNodeChanged.emit(nextNode);
        } else {
            // Last node, navigate back to assignments
            this.router.navigateByUrl('/student/assignments')
        }
    }

    navigateBack(): void {

    }

    onNodeSelected(): void {
        this.selectedNodeChanged.emit(this.selectedNode!);
    }

}