import { Component, Input, OnInit } from "@angular/core";
import { LearningPath, SpecificLearningPathRequest } from "../../interfaces/learning-path";
import { AuthenticationService } from "../../services/authentication.service";
import { UserType } from "../../interfaces";
import { LearningObject, ShallowLearningObject } from "../../interfaces/learning-object";
import { LearningObjectService } from "../../services/learningObject.service";
import { DirectedGraph, Node } from "../../datastructures/directed-graph";
import { LearningPathService } from "../../services/learningPath.service";

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
    fullObjectLoading: boolean = true;
    nodesLoading: boolean = true;
    isTeacher: boolean = false;
    learningObjects!: LearningObject[];

    constructor(private authService: AuthenticationService, private learningObjectService: LearningObjectService, private learningPathService: LearningPathService) { }

    ngOnInit(): void {
        // This boole indicates wether the logged in user is a teacher or not
        this.isTeacher = this.authService.retrieveUserType() === UserType.TEACHER;

        // Use the learning path to gather every learning object
        this.learningObjectService.retrieveObjectsForLearningPath(
            ({ hruid: this.path.hruid, language: this.path.language, includeNodes: true } as SpecificLearningPathRequest)
        ).subscribe(
            response => {
                // Full objects are in the response
                this.learningObjects = response;

                // Turn off loading when both calls are done
                this.fullObjectLoading = false;
                if (!this.nodesLoading) this.loading = false;
            }
        );

        // We also need to make sure we have the nodes available
        if (!this.path.nodes) {
            this.learningPathService.retrieveOneLearningPath(
                ({ hruid: this.path.hruid, language: this.path.language, includeNodes: true } as SpecificLearningPathRequest)
            ).subscribe(
                response => {
                    // Update the path
                    this.path.nodes = response.nodes!

                    // Turn off loading
                    this.nodesLoading = false;
                    if (!this.fullObjectLoading) this.loading = false
                }
            );
        } else this.nodesLoading = false;
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