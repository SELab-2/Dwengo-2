import { Component, Input, OnInit } from "@angular/core";
import { LearningPath, SpecificLearningPathRequest } from "../../interfaces/learning-path";
import { AuthenticationService } from "../../services/authentication.service";
import { UserType } from "../../interfaces";
import { LearningObject, ShallowLearningObject } from "../../interfaces/learning-object";
import { LearningObjectService } from "../../services/learningObject.service";
import { DirectedGraph, Node } from "../../datastructures/directed-graph";
import { LearningPathService } from "../../services/learningPath.service";
import { finalize, forkJoin, of } from "rxjs";

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

    // Trajectory based on transitions
    trajectoryGraph?: DirectedGraph<LearningObject>;


    constructor(private authService: AuthenticationService, private learningObjectService: LearningObjectService, private learningPathService: LearningPathService) { }

    ngOnInit(): void {
        // This boole indicates wether the logged in user is a teacher or not
        this.isTeacher = this.authService.retrieveUserType() === UserType.TEACHER;

        // These are the observables for both required calls
        const objectObservable = this.learningObjectService.retrieveObjectsForLearningPath(
            { hruid: this.path.hruid, language: this.path.language, includeNodes: true } as SpecificLearningPathRequest
        );

        const nodesObservable = this.path.nodes
            ? of(this.path) // If nodes already exist, we return the existing path
            : this.learningPathService.retrieveOneLearningPath(
                { hruid: this.path.hruid, language: this.path.language, includeNodes: true } as SpecificLearningPathRequest
            );

        forkJoin([objectObservable, nodesObservable]).pipe(
            finalize(() => this.loading = false)
        ).subscribe({
            next: ([objects, pathWithNodes]) => {
                this.learningObjects = objects;

                if (!this.path.nodes) {
                    this.path.nodes = pathWithNodes.nodes!;
                }

                // Build trajectory when we're done
                if (this.path.nodes && this.learningObjects) {
                    this.trajectoryGraph = this.trajectory(this.path.nodes, this.learningObjects);
                }
            },
            error: () => {
                // Errors are being handled within the service, but we need to turn off loading
                this.loading = false;
            }
        });
    }



    // Match helpfunction
    match(lo: ShallowLearningObject | ShallowLearningObject['transitions'], full: LearningObject): boolean {
        return (
            lo.version === full.metadata.version &&
            lo.language === full.metadata.language &&
            lo.hruid === full.metadata.hruid
        );
    }

    /**
    * Find the start node, follow the transitions and link the full objects. The full trajectory will be a directed graph.
    */
    trajectory(
        directions: ShallowLearningObject[],
        detailedObjects: LearningObject[]
    ): DirectedGraph<LearningObject> {

        // We will use our minimal implementation of a directed graph
        const graph = new DirectedGraph<LearningObject>();

        // Maps to search faster
        const objectMap = new Map<string, LearningObject>();
        const nodeMap = new Map<string, Node<LearningObject>>();

        // Identify based on hruid, version and language. Life would be easier if there was one necessary ID.
        const makeKey = (hruid: string, version: number, lang: string): string => `${hruid}_${version}_${lang}`;

        // We can assume that both object lists correspond semantically
        for (const obj of detailedObjects) {
            const key = makeKey(obj.metadata.hruid, obj.metadata.version, obj.metadata.language);
            objectMap.set(key, obj);
        }

        // Now we make the
        for (const shallow of directions) {
            const key = makeKey(shallow.hruid, shallow.version, shallow.language);
            const full = objectMap.get(key);

            // We once again assume both list contain the same learning objects
            const node = graph.addNode(full!);
            nodeMap.set(key, node);

            if (shallow.startNode) {
                graph.root = node;
            }
        }

        // Voeg de edges toe volgens de transitions
        for (const shallow of directions) {
            const fromKey = makeKey(shallow.hruid, shallow.version, shallow.language);
            const fromNode = nodeMap.get(fromKey);

            const transitions = Array.isArray(shallow.transitions)
                ? shallow.transitions
                : [shallow.transitions]; // if there only is one transition

            for (const trans of transitions) {
                const toKey = makeKey(trans.hruid, trans.version, trans.language);
                const toNode = nodeMap.get(toKey);
                graph.addEdge(fromNode!, toNode!);
            }
        }

        return graph;
    }

}