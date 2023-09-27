import { writable } from 'svelte/store';
import type {Grid, Node} from "$lib/astar";
import {createGrid} from "$lib/create-grid";
import {createAStar} from "$lib/astar";

export function createPathfinder() {
    const originalGrid = createGrid(10, 10);

    const pathfinder = createAStar(originalGrid,  3, 3, 6, 8);

    const grid = writable<Grid>(pathfinder.grid)

    const openSet = writable(pathfinder.openSet);
    const closedSet = writable(pathfinder.closedSet);

    const startNode = writable(pathfinder.startNode);
    const endNode = writable(pathfinder.endNode);

    const path = writable(new Array<Node>());
    const done = writable(false);

    function step() {
        const res = pathfinder.step();
        grid.set(pathfinder.grid);
        openSet.set(pathfinder.openSet);
        closedSet.set(pathfinder.closedSet);

        if (res === true) {
            path.set(pathfinder.getPath());
            done.set(true);
        }
    }

    return {
        step,
        grid,
        path,
        done,
        openSet,
        closedSet,
        startNode,
        endNode
    }
}