import { Injectable } from "@angular/core";
import { DirectedGraph, Node } from "../datastructures/directed-graph";
import { MinimalLearningObject, MinimalShallowLearningObject } from "../interfaces/learning-object";

@Injectable({
    providedIn: 'root'
})
export class GraphBuilderService {

    /**
    * Find the start node, follow the transitions and link the full objects. The full trajectory will be a directed graph.
    */
    buildTrajectoryGraph<T extends MinimalShallowLearningObject, S extends MinimalLearningObject>(
        directions: T[],
        detailedObjects: S[],
    ): DirectedGraph<S> {

        // We will use our minimal implementation of a directed graph
        const graph = new DirectedGraph<S>();

        // Maps to search faster
        const objectMap = new Map<string, S>();
        const nodeMap = new Map<string, Node<S>>();

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
                : [shallow.transitions];

            for (const trans of transitions) {
                const toKey = makeKey(trans.hruid, trans.version, trans.language);
                const toNode = nodeMap.get(toKey);
                graph.addEdge(fromNode!, toNode!);
            }
        }

        return graph;
    }
}
