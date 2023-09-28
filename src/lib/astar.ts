
export type Nullable<T> = T | null;

export interface Node {
    x: number;
    y: number;
    neighbors: Set<Node>;
    gScore: number; // distance from start
    hScore: number; // distance from end
    fScore: number // gScore + hScore
    cameFrom: Nullable<Node>;
}

function getLowestFScoreOf(openSet: Set<Node>): Nullable<Node> {
    return Array.from(openSet).reduce((a, b) => a.fScore! < b.fScore! ? a : b);
}

function distance(a: Node, b: Node): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function heuristic(neighbor: Node, endNode: Node) {
    return distance(neighbor, endNode);
}

export function createAStar() {
    const nodes = new Set<Node>();

    let startNode: Node | undefined;
    let endNode: Node | undefined;

    const openSet = new Set<Node>();
    const closedSet = new Set<Node>();

    function step() {
        if (!startNode || !endNode) {
            throw new Error("Start node or end node is undefined");
        }

        if (openSet.size === 0) {
            // no solution
            return false;
        }

        // current node is the node in the open set with the lowest f score
        const currentNode = getLowestFScoreOf(openSet)!;

        if (currentNode === endNode) {
            // we have reached the end
            return true;
        }

        openSet.delete(currentNode);
        closedSet.add(currentNode);

        for (const neighbor of currentNode.neighbors) {
            if (closedSet.has(neighbor)) {
                // if the neighbor is in the closed set, it has already been evaluated, so we can ignore it
                continue;
            }

            // distance from start to neighbor of current node
            const tentativeGScore = currentNode.gScore + distance(currentNode, neighbor);

            if (!openSet.has(neighbor)) {
                // we have discovered a new node, add it to the open set
                openSet.add(neighbor);
            }

            if (tentativeGScore < neighbor.gScore) {
                // we found the best path here
                neighbor.cameFrom = currentNode;
                neighbor.gScore = tentativeGScore;
                neighbor.hScore = heuristic(neighbor, endNode);
                neighbor.fScore = neighbor.gScore + neighbor.hScore;
            }
        }

        return null
    }

    function getPath() {
        const path = new Array<Node>();

        let currentNode = getLowestFScoreOf(openSet)!;

        while (currentNode !== startNode) {
            path.push(currentNode);
            currentNode = currentNode.cameFrom!;
        }

        path.push(startNode);

        return path.reverse();
    }

    function init(newNodes: Set<Node>, newStartNode: Node, newEndNode: Node) {
        nodes.clear();
        openSet.clear();
        closedSet.clear();

        for (const node of newNodes) {
            nodes.add(node);
        }

        startNode = newStartNode;
        endNode = newEndNode;

        openSet.add(startNode);
        startNode.gScore = 0;
    }

    return {
        init,
        step,
        getPath,
        nodes,
        startNode,
        endNode,
        openSet,
        closedSet,
    }
}