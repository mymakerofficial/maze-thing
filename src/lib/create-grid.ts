import {createNode} from "$lib/astar";
import type {Node} from "$lib/astar";
import type {Grid} from "$lib/astar";

export function createGrid(width: number, height: number): Grid {
    const grid = new Array<Array<Node>>(width) as Grid;

    for (let x = 0; x < grid.length; x++) {
        grid[x] = new Array<Node>(height);

        for (let y = 0; y < grid[x].length; y++) {
            const wall = Math.random() < 0.3;

            grid[x][y] = createNode(x, y, wall);
        }
    }

    return grid
}