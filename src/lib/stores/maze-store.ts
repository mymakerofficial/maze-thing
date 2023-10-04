import { writable } from 'svelte/store';
import {createRecursiveBacktrackerMaze} from "$lib/algorithms/maze";
import {randomBetween} from "$lib/utils";

export function createMaze() {
    const maze = createRecursiveBacktrackerMaze();

    const grid = writable(maze.grid);

    const stack = writable(maze.stack);
    const visitedSet = writable(maze.visitedSet);

    const done = writable(false);

    let interval: number | undefined;

    function setValues() {
        grid.set(maze.grid);
        stack.set(maze.stack);
        visitedSet.set(maze.visitedSet);
    }

    function step() {
        const res = maze.step();

        setValues();

        if (res) {
            done.set(true);
        }
    }

    function start() {
        interval = setInterval(() => {
            step();
        }, 1);
    }

    function stop() {
        if (interval === undefined) return;

        clearInterval(interval!);
    }

    function reset() {
        stop();
        maze.init(randomBetween(4, 40), randomBetween(4, 40))
        setValues();
        done.set(false);
    }

    return {
        start,
        stop,
        step,
        reset,
        done,
        grid,
        stack,
        visitedSet,
    }
}