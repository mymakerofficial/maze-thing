import {get, writable} from 'svelte/store';
import {createRecursiveBacktrackerMaze} from "$lib/algorithms/maze";
import {randomIntBetween} from "$lib/utils/math-utils";

export function createMaze() {
    const maze = createRecursiveBacktrackerMaze();

    const grid = writable(maze.grid);

    const stack = writable(maze.stack);
    const visitedSet = writable(maze.visitedSet);

    const steps = writable(0);
    const done = writable(false);

    let interval: number | undefined;

    function setValues() {
        grid.set(maze.grid);
        stack.set(maze.stack);
        visitedSet.set(maze.visitedSet);
    }

    function step() {
        if (get(done)) {
            stop();
            return;
        }

        const res = maze.step();

        steps.update(n => n + 1);
        setValues();

        if (res) {
            done.set(true);
        }
    }

    function start() {
        stop();
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
        maze.init(randomIntBetween(4, 40), randomIntBetween(4, 40))
        setValues();
        done.set(false);
        steps.set(0);
    }

    return {
        start,
        stop,
        step,
        reset,
        steps,
        done,
        grid,
        stack,
        visitedSet,
    }
}