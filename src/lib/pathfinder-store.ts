import { writable } from 'svelte/store';
import type {Grid, Node} from "$lib/astar";
import {createGrid} from "$lib/create-grid";
import {createAStar} from "$lib/astar";

export function createPathfinder() {
    const width = 40;
    const height = 40;

    const originalGrid = createGrid(width, height);

    const pathfinder = createAStar(originalGrid,  Math.round(Math.random() * width), Math.round(Math.random() * height), Math.round(Math.random() * width), Math.round(Math.random() * height));

    const grid = writable<Grid>(pathfinder.grid)

    const openSet = writable(pathfinder.openSet);
    const closedSet = writable(pathfinder.closedSet);

    const startNode = writable(pathfinder.startNode);
    const endNode = writable(pathfinder.endNode);

    const path = writable(new Array<Node>());
    const done = writable(false);

    function start() {
        setInterval(() => {
            step();
        }, 10);
    }

    function step() {
        const res = pathfinder.step();
        grid.set(pathfinder.grid);
        openSet.set(pathfinder.openSet);
        closedSet.set(pathfinder.closedSet);

        path.set(pathfinder.getPath());

        if (res === true) {
            done.set(true);
            return;
        }
    }

    return {
        start,
        grid,
        path,
        done,
        openSet,
        closedSet,
        startNode,
        endNode
    }
}