import type {ConnectedNode} from "$lib/models/node";
import type {Nullable} from "$lib/models/types";

export interface AstarNode extends ConnectedNode {
    gScore: number,
    hScore: number,
    fScore: number,
    cameFrom: Nullable<AstarNode>,
}

export function createAstarNode(node: Partial<AstarNode>): AstarNode {
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