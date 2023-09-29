import type { Grid } from "./grid";

export function randomFloatBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function randomBetween(min: number, max: number): number {
    return Math.floor(randomFloatBetween(min, max));
}

export function chooseRandom<T>(set: Set<T>) {
    return Array.from(set)[randomBetween(0, set.size)]
}

export function gridWidth(grid: Grid): number {
    return grid.length;
}

export function gridHeight(grid: Grid): number {
    return grid[0].length;
}

// checks if the given point is inside the given infinite cone
export function isInVisionCone(x: number, y: number, coneX: number, coneY: number, coneDirection: number, coneAngle: number): boolean {
    const angle = Math.atan2(y - coneY, x - coneX);

    const diff = Math.abs(angle - coneDirection);

    return diff < coneAngle / 2;
}

export function create2dArray<T>(width: number = 1, height: number = 1) {
    const array = new Array<Array<T>>(width);

    for (let i = 0; i < array.length; i++) {
        array[i] = new Array<T>(height);
    }

    return array;
}
