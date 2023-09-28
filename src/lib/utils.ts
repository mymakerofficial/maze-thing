import type { Grid } from "./grid";

export function randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function chooseRandom<T>(set: Set<T>) {
    return Array.from(set)[randomBetween(0, set.size - 1)]
}

export function gridWidth(grid: Grid): number {
    return grid.length;
}

export function gridHeight(grid: Grid): number {
    return grid[0].length;
}