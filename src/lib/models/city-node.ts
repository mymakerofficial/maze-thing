import type {ConnectedNode} from "$lib/models/node";

export interface CityNode extends ConnectedNode {
    magnitude: number;
    depth: number;
}

export function createCityNode(node: Partial<CityNode>): CityNode {
    return {
        x: 0,
        y: 0,
        neighbors: new Set(),
        magnitude: 0,
        depth: 0,
        ...node,
    }
}