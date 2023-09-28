import {createGrid, replaceGrid} from "$lib/grid";
import type { Cell, Grid } from "$lib/grid";
import {chooseRandom, gridHeight, gridWidth, randomBetween} from "$lib/utils";

function get(grid: Grid, x: number, y: number): Cell {
    return grid[x][y];
}

function getNeighbors(grid: Grid, cell: Cell): Set<Cell> {
    const neighbors = new Set<Cell>();

    const width = gridWidth(grid);
    const height = gridHeight(grid);

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
export function createRecursiveBacktrackerMaze() {
    const grid = createGrid(1, 1);

    const stack = new Array<Cell>();

    const visitedSet = new Set<Cell>();

    let currentCell = get(grid, 0, 0);

    /***
     @returns true if the maze is complete
     @returns false if the maze is not complete
    */
    function step(): boolean {
        if (stack.length === 0) {
            return true;
        }

        // if (visitedSet.size === gridWidth(grid) * gridHeight(grid)) {
        //     return true;
        // }

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

    function init(width?: number, height?: number) {
        if (width !== undefined && height !== undefined) {
            replaceGrid(grid, createGrid(width, height));
        }

        stack.length = 0;
        visitedSet.clear();

        currentCell = get(grid, randomBetween(0, gridWidth(grid) - 1), randomBetween(0, gridHeight(grid) - 1));

        visitedSet.add(currentCell);
        stack.push(currentCell);
    }

    return {
        step,
        init,
        grid,
        stack,
        visitedSet,
        currentCell
    }
}