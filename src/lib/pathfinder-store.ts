import { writable } from 'svelte/store';
import type {Node} from "$lib/astar";
import {createGrid} from "$lib/grid";
import type {Grid} from "$lib/grid";
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

    function init(newNodes: Set<Node>, startX: number, startY: number, endX: number, endY: number) {
        stop();

        const newStartNode = getInSet(newNodes, startX, startY);
        const newEndNode = getInSet(newNodes, endX, endY);

        pathfinder.init(newNodes, newStartNode, newEndNode);

        setValues();

        done.set(false);
        startNode.set(newStartNode);
        endNode.set(newEndNode);
    }

    function reset() {
        const grid = createGrid(randomBetween(10, 40), randomBetween(10, 40), false);
        init(gridToNodes(grid), randomBetween(0, gridWidth(grid) - 1), randomBetween(0, gridHeight(grid) - 1), randomBetween(0, gridWidth(grid) - 1), randomBetween(0, gridHeight(grid) - 1))
    }

    return {
        start,
        stop,
        step,
        reset,
        init,
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