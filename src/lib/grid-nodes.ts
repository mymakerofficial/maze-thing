import type {Node} from "$lib/astar";
import type {Cell, Grid} from "./grid";
import {createGrid} from "./grid";

export function getInGrid(grid: Grid, x: number, y: number): Cell {
    return grid.flat().find(cell => cell.x === x && cell.y === y)!;
}

export function getInSet(nodes: Set<Node>, x: number, y: number): Node {
    return Array.from(nodes).find(node => node.x === x && node.y === y)!;
}

function getNeighbors(nodes: Set<Node>, grid: Grid, node: Node): Set<Node> {
    const neighbors = new Set<Node>;

    const width = grid.length;
    const height = grid[0].length;

    const x = node.x;
    const y = node.y;

    // left
    if (x > 0 && !getInGrid(grid, x, y).wallLeft) {
        neighbors.add(getInSet(nodes, x - 1, y));
    }

    // right
    if (x < width - 1 && !getInGrid(grid, x, y).wallRight) {
        neighbors.add(getInSet(nodes, x + 1, y));
    }

    // top
    if (y > 0 && !getInGrid(grid, x, y).wallTop) {
        neighbors.add(getInSet(nodes, x, y - 1));
    }

    // bottom
    if (y < height - 1 && !getInGrid(grid, x, y).wallBottom) {
        neighbors.add(getInSet(nodes, x, y + 1));
    }

    return neighbors;
}

function hasNeighborInDirection(nodes: Set<Node>, node: Node, direction: "left" | "right" | "top" | "bottom"): boolean {
    const x = node.x;
    const y = node.y;

    switch (direction) {
        case "left":
            return Array.from(nodes).some(n => n.x === x - 1 && n.y === y);
        case "right":
            return Array.from(nodes).some(n => n.x === x + 1 && n.y === y);
        case "top":
            return Array.from(nodes).some(n => n.x === x && n.y === y - 1);
        case "bottom":
            return Array.from(nodes).some(n => n.x === x && n.y === y + 1);
    }
}

export function gridToNodes(grid: Grid): Set<Node> {
    const nodes = new Set<Node>();

    for (let x = 0; x < grid.length; x++) {
        const row = grid[x];

        for (let y = 0; y < row.length; y++) {
            const cell = row[y];

            const node: Node = {
                x: cell.x,
                y: cell.y,
                neighbors: new Set<Node>(),
                gScore: Infinity,
                hScore: 0,
                fScore: 0,
                cameFrom: null,
            }

            nodes.add(node);
        }
    }

    for (const node of nodes) {
        node.neighbors = getNeighbors(nodes, grid, node);
    }

    return nodes;
}

export function nodesToGrid(nodes: Set<Node>): Grid {
    if (nodes.size === 0) {
        return [[]]
    }

    const minX = Math.min(...Array.from(nodes).map(node => node.x));
    const minY = Math.min(...Array.from(nodes).map(node => node.y));
    const maxX = Math.max(...Array.from(nodes).map(node => node.x));
    const maxY = Math.max(...Array.from(nodes).map(node => node.y));

    const grid = createGrid(maxX - minX + 1, maxY - minY + 1, true)

    for (const node of nodes) {
        grid[node.x - minX][node.y - minY] = {
            x: node.x,
            y: node.y,
            wallTop: !hasNeighborInDirection(node.neighbors, node, "top"),
            wallRight: !hasNeighborInDirection(node.neighbors, node, "right"),
            wallBottom: !hasNeighborInDirection(node.neighbors, node, "bottom"),
            wallLeft: !hasNeighborInDirection(node.neighbors, node, "left")
        }
    }

    return grid;
}

export function nodeFromCell(cell: Cell, nodes: Set<Node>): Node {
    return getInSet(nodes, cell.x, cell.y);
}