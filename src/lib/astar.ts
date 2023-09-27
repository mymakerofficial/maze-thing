
export type Nullable<T> = T | null;

export interface Node {
    x: number;
    y: number;
    gScore: number; // distance from start
    hScore: number; // distance from end
    fScore: number // gScore + hScore
    cameFrom: Nullable<Node>;
}

export type Grid = Array<Array<Node>>;

export function createNode(x: number, y: number): Node {
    return {
        x,
        y,
        gScore: Infinity,
        hScore: 0,
        fScore: 0,
        cameFrom: null
    };
}

function get(grid: Grid, x: number, y: number): Node {
    return grid[x][y];
}

function getLowestFScoreOf(openSet: Set<Node>): Nullable<Node> {
    return Array.from(openSet).reduce((a, b) => a.fScore! < b.fScore! ? a : b);
}

function getNeighbors(grid: Grid, node: Node): Array<Node> {
    const neighbors = new Array<Node>;

    const x = node.x;
    const y = node.y;

    if (x > 0) {
        neighbors.push(get(grid, x - 1, y));
    }

    if (x < grid.length - 1) {
        neighbors.push(get(grid, x + 1, y));
    }

    if (y > 0) {
        neighbors.push(get(grid, x, y - 1));
    }

    if (y < grid[0].length - 1) {
        neighbors.push(get(grid, x, y + 1));
    }

    return neighbors;
}

function distance(a: Node, b: Node): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function heuristic(neighbor: Node, endNode: Node) {
    // return Math.abs(neighbor.x - endNode.x) + Math.abs(neighbor.y - endNode.y);
    return distance(neighbor, endNode);
}

export function createAStar(grid: Grid, startX: number, startY: number, endX: number, endY: number) {
    const openSet = new Set<Node>();
    const closedSet = new Set<Node>();

    const startNode = get(grid, startX, startY);
    const endNode = get(grid, endX, endY);

    openSet.add(startNode);
    startNode.gScore = 0;

    function step() {
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

        const neighbors = getNeighbors(grid, currentNode);

        for (const neighbor of neighbors) {
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

        let currentNode = endNode;

        while (currentNode !== startNode) {
            path.push(currentNode);
            currentNode = currentNode.cameFrom!;
        }

        path.push(startNode);

        return path.reverse();
    }

    return {
        step,
        getPath,
        grid,
        startNode,
        endNode,
        openSet,
        closedSet,
    }
}