// We need a minimal implementation of a Directed Graph to model the learning path transitions
export class DirectedGraph<T> {

    // I use Maps to do quick lookups if needed
    private _nodes: Map<T, Node<T>> = new Map();
    private _adjacencyList: Map<T, Edge<T>[]> = new Map();

    // Add a node to the graph
    public addNode(value: T): Node<T> {
        if (!this.hasNode(value)) {
            const node = new Node<T>(value);
            this._nodes.set(value, node);
            this._adjacencyList.set(value, []);
        }
        return this._nodes.get(value)!;
    }

    // Connect nodes (they don't have to exist yet)
    public addEdge(from: T, to: T): void {
        this.addNode(from);
        this.addNode(to);
        const edge = new Edge<T>(from, to);
        this._adjacencyList.get(from)!.push(edge);
    }

    // Getter for the nodes
    public get nodes(): Node<T>[] {
        return Array.from(this._nodes.values());
    }

    // Getter for the edges
    public get edges(): Edge<T>[] {
        return Array.from(this._adjacencyList.values()).flat();
    }

    // Getter for outgoing edges of a value
    public getOutgoingEdges(value: T): Edge<T>[] {
        return this._adjacencyList.get(value) ?? [];
    }

    // Get the nodes connected to all outgoing edges
    public getNeighbors(value: T): T[] {
        return this.getOutgoingEdges(value).map(edge => edge.to);
    }

    // Check if the nodes exists
    public hasNode(value: T): boolean {
        return this._nodes.has(value);
    }
}

// Minimal implementation of a Node
export class Node<T> {
    constructor(private _value: T) { }

    public get value(): T {
        return this._value;
    }
}

// Minimal implementation of an Edge
export class Edge<T> {
    constructor(private _from: T, private _to: T) { }

    public get from(): T {
        return this._from;
    }

    public get to(): T {
        return this._to;
    }
}
