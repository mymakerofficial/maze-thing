import type {Vector} from "$lib/models/vector";
import {createVector} from "$lib/models/vector";

export function randomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function randomIntBetween(min: number, max: number): number {
    return Math.floor(randomBetween(min, max));
}

export function chooseRandom<T>(set: Set<T>) {
    return Array.from(set)[randomIntBetween(0, set.size)]
}

export function randomVectorBetween(min: Vector, max: Vector): Vector {
    return {
        x: randomBetween(min.x, max.x),
        y: randomBetween(min.y, max.y)
    }
}

export function randomIntVectorBetween(min: Vector, max: Vector): Vector {
    return {
        x: randomIntBetween(min.x, max.x),
        y: randomIntBetween(min.y, max.y)
    }
}

export function randomInRadius(center: Vector, radius: number): Vector {
    const angle = Math.random() * 2 * Math.PI;

    const x = Math.round(center.x + Math.cos(angle) * radius);
    const y = Math.round(center.y + Math.sin(angle) * radius);

    return createVector(x, y);
}

export function randomAngle(): number {
    return Math.random() * 2 * Math.PI;
}

export function angleToVector(angle: number, magnitude: number = 1): Vector {
    return createVector(
        Math.cos(angle) * magnitude,
        Math.sin(angle) * magnitude,
    )
}