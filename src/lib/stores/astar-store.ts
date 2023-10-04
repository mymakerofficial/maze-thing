import { createAStar } from '$lib/algorithms/astar';
import type { AStarNode } from '$lib/models/a-star-node';
import {get, writable } from 'svelte/store';
import type {ConnectedNode} from "$lib/models/node";
import type {Vector} from "$lib/models/vector";


export function createAStarStore() {
    const aStar = createAStar();

    const nodes = writable(aStar.nodes)

    const openSet = writable(aStar.openSet);
    const closedSet = writable(aStar.closedSet);

    const startNode = writable(aStar.startNode);
    const endNode = writable(aStar.endNode);

    const path = writable(new Array<AStarNode>());
    const done = writable(false);

    let interval: number | undefined;

    function setValues() {
        nodes.set(aStar.nodes);
        openSet.set(aStar.openSet);
        closedSet.set(aStar.closedSet);
        path.set(aStar.getPath());
    }

    function step() {
        if (get(done)) {
            stop();
            return;
        }

        const res = aStar.step();

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

    function init(newNodes: Set<ConnectedNode>, startPos: Vector, endPos: Vector) {
        stop();

        aStar.init(newNodes, startPos, endPos);

        startNode.set(aStar.startNode!);
        endNode.set(aStar.endNode!);
        done.set(false);

        setValues();
    }

    return {
        start,
        stop,
        step,
        init,
        nodes,
        path,
        done,
        openSet,
        closedSet,
        startNode,
        endNode
    }
}