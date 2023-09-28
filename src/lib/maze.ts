import {createGrid} from "$lib/grid";
import type { Cell, Grid } from "$lib/grid";

function get(grid: Grid, x: number, y: number): Cell {
    return grid[x][y];
}

function randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function chooseRandom<T>(set: Set<T>) {
    return Array.from(set)[randomBetween(0, set.size - 1)]
}

function getNeighbors(grid: Grid, cell: Cell): Set<Cell> {
    const neighbors = new Set<Cell>();

    const width = grid.length;
    const height = grid[0].length;

    const x = cell.x;
    const y = cell.y;

    // left
    if (x > 0) {
        neighbors.add(get(grid, x - 1, y));
    }

    // right
    if (x < width - 1) {
        neighbors.add(get(grid, x + 1, y));
    }

    // top
    if (y > 0) {
        neighbors.add(get(grid, x, y - 1));
    }

    // bottom
    if (y < height - 1) {
        neighbors.add(get(grid, x, y + 1));
    }

    return neighbors;
}

function getUnvisitedNeighbors(grid: Grid, cell: Cell, visitedSet: Set<Cell>): Set<Cell> {
    const neighbors = getNeighbors(grid, cell);

    const unvisitedNeighbors = new Set<Cell>();

    for (const neighbor of neighbors) {
        if (!visitedSet.has(neighbor)) {
            unvisitedNeighbors.add(neighbor);
        }
    }

    return unvisitedNeighbors;
}

function removeWallsBetween(cellA: Cell, cellB: Cell) {
    const xDiff = cellA.x - cellB.x;
    const yDiff = cellA.y - cellB.y;

    if (xDiff !== 0 && yDiff !== 0) {
        throw new Error("Cells are not adjacent");
    }

    if (xDiff === 1) {
        cellA.wallLeft = false;
        cellB.wallRight = false;
    } else if (xDiff === -1) {
        cellA.wallRight = false;
        cellB.wallLeft = false;
    }

    if (yDiff === 1) {
        cellA.wallTop = false;
        cellB.wallBottom = false;
    } else if (yDiff === -1) {
        cellA.wallBottom = false;
        cellB.wallTop = false;
    }
}

// https://en.wikipedia.org/wiki/Maze_generation_algorithm?useskin=vector#Randomized_depth-first_search
export function createRecursiveBacktrackerMaze(width: number, height: number) {
    const grid = createGrid(width, height);

    const stack = new Array<Cell>();

    const visitedSet = new Set<Cell>();

    let currentCell = get(grid, randomBetween(0, width), randomBetween(0, height));

    visitedSet.add(currentCell);
    stack.push(currentCell);

    /***
     @returns true if the maze is complete
     @returns false if the maze is not complete
    */
    function step(): boolean {
        if (stack.length === 0) {
            return true;
        }

        if (visitedSet.size === width * height) {
            return true;
        }

        currentCell = stack.pop()!;

        const notVisitedNeighbors = getUnvisitedNeighbors(grid, currentCell, visitedSet);

        if (notVisitedNeighbors.size > 0) {
            stack.push(currentCell);

            const selectedCell = chooseRandom(notVisitedNeighbors);

            removeWallsBetween(currentCell, selectedCell);

            visitedSet.add(selectedCell);
            stack.push(selectedCell);
        }

        return false;
    }

    return {
        step,
        grid,
        stack,
        visitedSet,
        currentCell
    }
}