import type {Vector} from "$lib/models/vector";

export interface ConnectedNode extends Vector {
    neighbors: Set<ConnectedNode>;
}

// return a new node with the given properties
export function createNode(node: Partial<ConnectedNode> | Vector): ConnectedNode {
    return {
        x: 0,
        y: 0,
        neighbors: new Set(),
        ...node,
    }
}