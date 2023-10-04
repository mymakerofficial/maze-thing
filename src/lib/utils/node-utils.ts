import type {Vector} from "$lib/models/vector";
import type {ConnectedNode} from "$lib/models/node";

export function getNodeByPosition<T extends ConnectedNode>(elements: Set<T> | Array<T>, position: Vector): T | undefined {
    return Array.from(elements).find(e => e.x === position.x && e.y === position.y)
}

export function positionFromNode<T extends Vector>(node: T): Vector {
    return {x: node.x, y: node.y};
}

export function connectNodes<T extends ConnectedNode>(a: T, b: T) {
    if (a === b) {
        return
    }

    if (a.neighbors.has(b) || b.neighbors.has(a)) {
        return
    }

    a.neighbors.add(b);
    b.neighbors.add(a);
}