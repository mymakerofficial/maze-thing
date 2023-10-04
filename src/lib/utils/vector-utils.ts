import type {Vector} from "$lib/models/vector";
import {createVector} from "$lib/models/vector";

export function addVectors(a: Vector, b: Vector) {
    return createVector(a.x + b.x, a.y + b.y);
}

export function subtractVectors(a: Vector, b: Vector) {
    return createVector(a.x - b.x, a.y - b.y);
}

export const UP = createVector(0, -1);
export const DOWN = createVector(0, 1);
export const LEFT = createVector(-1, 0);
export const RIGHT = createVector(1, 0);
export const NULL_VECTOR = createVector(0, 0);

export function euclideanDistance(a: Vector, b: Vector): number {
    if (!a || !b) {
        return Infinity;
    }
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function compareVectors(a: Vector, b: Vector): boolean {
    if (!a || !b) {
        return false;
    }
    return a.x === b.x && a.y === b.y;
}