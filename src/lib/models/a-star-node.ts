import type {ConnectedNode} from "$lib/models/node";
import type {Nullable} from "$lib/models/types";

export interface AStarNode extends ConnectedNode {
    neighbors: Set<AStarNode>,
    gScore: number,
    hScore: number,
    fScore: number,
    cameFrom: Nullable<AStarNode>,
}

export function createAStarNode(node: Partial<AStarNode>): AStarNode {
    return {
        x: 0,
        y: 0,
        neighbors: new Set(),
        gScore: Infinity,
        hScore: 0,
        fScore: 0,
        cameFrom: null,
        ...node,
    }
}