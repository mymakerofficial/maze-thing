import { writable } from 'svelte/store';
import type {Node} from "$lib/astar";
import {createGrid} from "$lib/grid";
import {createAStar} from "$lib/astar";
import {getInSet, gridToNodes, nodesToGrid} from "$lib/grid-nodes";
import {gridHeight, gridWidth, randomBetween} from "$lib/utils";

export function createPathfinder() {
    const pathfinder = createAStar();

    const nodes = writable(pathfinder.nodes)
    const grid = writable(nodesToGrid(pathfinder.nodes));

    const openSet = writable(pathfinder.openSet);
    const closedSet = writable(pathfinder.closedSet);

    const startNode = writable(pathfinder.startNode);
    const endNode = writable(pathfinder.endNode);

    const path = writable(new Array<Node>());
    const done = writable(false);

    let interval: number | undefined;

    function setValues() {
        nodes.set(pathfinder.nodes);
        grid.set(nodesToGrid(pathfinder.nodes));
        openSet.set(pathfinder.openSet);
        closedSet.set(pathfinder.closedSet);
        path.set(pathfinder.getPath());
    }

    function step() {
        const res = pathfinder.step();

        setValues();

        if (res === true) {
            done.set(true);
        }
    }

    function start() {
        interval = setInterval(() => {
            step();
        }, 1);
    }

    function stop() {
        clearInterval(interval);
    }

    function reset() {
        stop();

        const grid = createGrid(randomBetween(10, 30), randomBetween(10, 30), false);
        const nodes = gridToNodes(grid);

        const newStartNode = getInSet(nodes, randomBetween(0, gridWidth(grid) - 1), randomBetween(0, gridHeight(grid) - 1));
        const newEndNode = getInSet(nodes, randomBetween(0, gridWidth(grid) - 1), randomBetween(0, gridHeight(grid) - 1));

        pathfinder.init(nodes, newStartNode, newEndNode);

        setValues();

        done.set(false);
        startNode.set(newStartNode);
        endNode.set(newEndNode);
    }

    return {
        start,
        stop,
        step,
        reset,
        nodes,
        grid,
        path,
        done,
        openSet,
        closedSet,
        startNode,
        endNode
    }
}