import {chooseRandom, randomBetween} from "$lib/utils";
import type {Node, Nullable} from "$lib/astar";
import {connectNodes} from "$lib/nodes";

export interface Point2 {
    x: number;
    y: number;
}

function createNode(x: number, y: number): Node {
    return {
        x,
        y,
        neighbors: new Set<Node>(),
        gScore: Infinity,
        hScore: 0,
        fScore: 0,
        cameFrom: null,
    }
}

function distance(a: Node, b: Node): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function findClosestNode(nodes: Set<Node>, node: Node): Nullable<Node> {
    let closestNode: Node | undefined;
    let closestDistance = Infinity;

    for (const otherNode of nodes) {
        if (otherNode === node) {
            continue;
        }

        const dist = distance(node, otherNode);

        if (dist < closestDistance) {
            closestNode = otherNode;
            closestDistance = dist;
        }
    }

    if (!closestNode) {
        return null
    }

    return closestNode;
}

function randomInRadius(center: Point2, radius: number): Point2 {
    const angle = Math.random() * 2 * Math.PI;

    const x = Math.round(center.x + Math.cos(angle) * radius);
    const y = Math.round(center.y + Math.sin(angle) * radius);

    return {x, y};
}

// generate a set of nodes in the approximate shape of cities
export function createCity() {
    const nodes = new Set<Node>();

    function step() {
        for (let i = 0; i < 200; i++) {
            const point = randomInRadius({x: 0, y: 0}, i / 10);

            const newNode = createNode(point.x, point.y);
            nodes.add(newNode);
        }

        for (let i = 0; i < 800; i++) {
            const lowConnectivityNodes = new Set(Array.from(nodes).filter(node => node.neighbors.size < 6));

            const currentNode = chooseRandom(lowConnectivityNodes);

            const possibleNeighbors = new Set(Array.from(lowConnectivityNodes).filter(node => !node.neighbors.has(currentNode)).filter(node => distance(node, currentNode) < 6));

            const closestNode = findClosestNode(possibleNeighbors, currentNode);

            if (!closestNode) {
                continue;
            }

            connectNodes(currentNode, closestNode);
        }
    }

    function init() {
        nodes.clear();
    }

    return {
        step,
        init,
        nodes,
    }
}