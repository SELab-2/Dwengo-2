// We need a minimal implementation of a Directed Graph to model the learning path transitions
export class DirectedGraph<T> {

    // I use Maps to do quick lookups if needed
    private _nodes: Map<T, Node<T>> = new Map();
    private _adjacencyList: Map<T, Edge<T>[]> = new Map();

    // Every learning path has exactly one root.
    private _root: Node<T> | null = null;

    // Add a node to the graph
    public addNode(value: T): Node<T> {
        if (!this.hasNode(value)) {
            const node = new Node<T>(value);
            this._nodes.set(value, node);
            this._adjacencyList.set(value, []);
        }
        return this._nodes.get(value)!;
    }

    // Connect nodes
    public addEdge(from: Node<T>, to: Node<T>): void {
        const edge = new Edge<T>(from, to);
        this._adjacencyList.get(from.value)!.push(edge);
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
    public getNeighbors(value: T): Node<T>[] {
        return this.getOutgoingEdges(value).map(edge => edge.to);
    }

    // Check if the nodes exists
    public hasNode(value: T): boolean {
        return this._nodes.has(value);
    }

    public get root(): Node<T> | null {
        return this._root;
    }

    public set root(node: Node<T>) {
        this._root = node;
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
    constructor(private _from: Node<T>, private _to: Node<T>) { }

    public get from(): Node<T> {
        return this._from;
    }

    public get to(): Node<T> {
        return this._to;
    }
}
