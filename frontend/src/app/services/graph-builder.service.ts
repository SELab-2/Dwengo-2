import { Injectable } from "@angular/core";
import { DirectedGraph, Node } from "../datastructures/directed-graph";
import { LearningObject, ShallowLearningObject } from "../interfaces/learning-object";

@Injectable({
    providedIn: 'root'
})
export class GraphBuilderService {

    /**
    * Find the start node, follow the transitions and link the full objects. The full trajectory will be a directed graph.
    */
    buildTrajectoryGraph(
        directions: ShallowLearningObject[],
        detailedObjects: LearningObject[]
    ): DirectedGraph<LearningObject> {

        // We will use our minimal implementation of a directed graph
        const graph = new DirectedGraph<LearningObject>();

        // Maps to search faster
        const objectMap = new Map<string, LearningObject>();
        const nodeMap = new Map<string, Node<LearningObject>>();

        // Identify based on hruid, version and language. Life would be easier if there was one necessary ID.
        const makeKey = (hruid: string, version: number, lang: string): string =>
            `${hruid}_${version}_${lang}`;

        // We can assume that both object lists correspond semantically
        for (const obj of detailedObjects) {
            const key = makeKey(obj.metadata.hruid, obj.metadata.version, obj.metadata.language);
            objectMap.set(key, obj);
        }

        // Initialize all nodes
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

        // Now we make the edges
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
