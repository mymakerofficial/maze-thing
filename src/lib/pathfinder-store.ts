import { writable } from 'svelte/store';
import type {Node} from "$lib/astar";
import {createGrid} from "$lib/grid";
import {createAStar} from "$lib/astar";
import {getInSet, gridToNodes, nodesToGrid} from "$lib/grid-nodes";

export function createPathfinder() {
    const width = 20;
    const height = 20;

    const originalGrid = createGrid(width, height);

    const originalNodes = gridToNodes(originalGrid);
    const originalStartNode = getInSet(originalNodes, Math.floor(Math.random() * width), Math.floor(Math.random() * height));
    const originalEndNode = getInSet(originalNodes, Math.floor(Math.random() * width), Math.floor(Math.random() * height))

    const pathfinder = createAStar(originalNodes, originalStartNode, originalEndNode);

    const nodes = writable(pathfinder.nodes)
    const grid = writable(originalGrid);

    const openSet = writable(pathfinder.openSet);
    const closedSet = writable(pathfinder.closedSet);

    const startNode = writable(pathfinder.startNode);
    const endNode = writable(pathfinder.endNode);

    const path = writable(new Array<Node>());
    const done = writable(false);

    function start() {
        setInterval(() => {
            step();
        }, 1);
    }

    function step() {
        const res = pathfinder.step();
        nodes.set(pathfinder.nodes);
        grid.set(nodesToGrid(pathfinder.nodes));
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