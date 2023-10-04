import type { Node } from "$lib/algorithms/astar";

export function createNode(x: number, y: number): Node {
    return {
        x,
        y,
        neighbors: new Set(),
        gScore: Infinity,
        hScore: 0,
        fScore: 0,
        cameFrom: null,
    }
}

export function connectNodes(a: Node, b: Node) {
    if (a === b) {
        return
    }

    if (a.neighbors.has(b) || b.neighbors.has(a)) {
        return
    }

    a.neighbors.add(b);
    b.neighbors.add(a);
}