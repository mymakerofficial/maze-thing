export interface Vector {
    x: number;
    y: number;
}

export function createVector(x: number, y: number): Vector {
    return {
        x,
        y,
    }
}