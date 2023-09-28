import { writable } from 'svelte/store';
import {createRecursiveBacktrackerMaze} from "$lib/maze";

export function createMaze() {
    const width = 20;
    const height = 20;

    const maze = createRecursiveBacktrackerMaze(width, height);

    const grid = writable(maze.grid);

    const stack = writable(maze.stack);
    const visitedSet = writable(maze.visitedSet);

    const done = writable(false);

    function start() {
        setInterval(() => {
            step();
        }, 1);
    }

    function step() {
        const res = maze.step();
        grid.set(maze.grid);
        stack.set(maze.stack);
        visitedSet.set(maze.visitedSet);

        if (res) {
            done.set(true);
            return;
        }
    }

    return {
        start,
        step,
        grid,
        stack,
        visitedSet,
    }
}