import type {Grid, GridCell} from "$lib/models/grid";
import type {Vector} from "$lib/models/vector";
import {LEFT, RIGHT, UP, subtractVectors, DOWN, addVectors, compareVectors} from "$lib/utils/vector-utils";
import {randomIntVectorBetween} from "$lib/utils/math-utils";
import {createVector} from "$lib/models/vector";

export function getCellByPosition(grid: Grid, position: Vector): GridCell | undefined {
    return grid[position.x]?.[position.y];
}

export function positionFromCell(cell: GridCell): Vector {
    return {x: cell.x, y: cell.y};
}

export function gridWidth(grid: Grid): number {
    return grid.length;
}

export function gridHeight(grid: Grid): number {
    return grid[0].length;
}

export function getNeighbors(grid: Grid, cell: GridCell): Set<GridCell> {
    const neighbors = new Set<GridCell>();

    const directions = [LEFT, RIGHT, UP, DOWN];

    for (const direction of directions) {
        const neighbor = getCellByPosition(grid, addVectors(cell, direction));

        if (neighbor) {
            neighbors.add(neighbor);
        }
    }

    return neighbors;
}

export function setWallsBetween(cellA: GridCell, cellB: GridCell, wall: boolean = false) {
    const diff = subtractVectors(cellB, cellA);

    if (compareVectors(diff, LEFT)) {
        cellA.wallLeft = wall;
        cellB.wallRight = wall;
    } else if (compareVectors(diff, RIGHT)) {
        cellA.wallRight = wall;
        cellB.wallLeft = wall;
    } else if (compareVectors(diff, UP)) {
        cellA.wallTop = wall;
        cellB.wallBottom = wall;
    } else if (compareVectors(diff, DOWN)) {
        cellA.wallBottom = wall;
        cellB.wallTop = wall;
    } else {
        throw new Error("Cells are not adjacent");
    }
}

// replace a grid without losing the reference to the original grid
export function replaceGrid(grid: Grid, newGrid: Grid) {
    grid.splice(0, grid.length, ...newGrid);
}

export function randomCellIn(grid: Grid): GridCell {
    return getCellByPosition(grid, randomIntVectorBetween(createVector(0, 0), createVector(gridWidth(grid), gridHeight(grid))))!;
}