import type {AStarNode} from "$lib/models/a-star-node";
import {euclideanDistance} from "$lib/utils/vector-utils";
import type {ConnectedNode} from "$lib/models/node";
import {connectedNodesToAStarNodes} from "$lib/mappers/astar-node-mapper";
import type { Vector } from "$lib/models/vector";
import {getNodeByPosition} from "$lib/utils/node-utils";

function getLowestFScoreOf(openSet: Set<AStarNode>): AStarNode | undefined {
    return Array.from(openSet).reduce((a, b) => a.fScore! < b.fScore! ? a : b);
}

function distance(a: AStarNode, b: AStarNode) {
    return euclideanDistance(a, b);
}

function heuristic(neighbor: AStarNode, endNode: AStarNode) {
    return distance(neighbor, endNode);
}

export function createAStar() {
    const nodes = new Set<AStarNode>();

    let startNode: AStarNode | undefined;
    let endNode: AStarNode | undefined;

    const openSet = new Set<AStarNode>();
    const closedSet = new Set<AStarNode>();

    function step() {
        if (!startNode || !endNode) {
            throw new Error("Start node or end node is undefined");
        }

        if (openSet.size === 0) {
            // no solution
            return false;
        }

        // current node is the node in the open set with the lowest f score
        const currentNode = getLowestFScoreOf(openSet)!;

        if (currentNode === endNode) {
            // we have reached the end
            return true;
        }

        openSet.delete(currentNode);
        closedSet.add(currentNode);

        for (const neighbor of currentNode.neighbors) {
            if (closedSet.has(neighbor)) {
                // if the neighbor is in the closed set, it has already been evaluated, so we can ignore it
                continue;
            }

            // distance from start to neighbor of current node
            const tentativeGScore = currentNode.gScore + distance(currentNode, neighbor);

            if (!openSet.has(neighbor)) {
                // we have discovered a new node, add it to the open set
                openSet.add(neighbor);
            }

            if (tentativeGScore < neighbor.gScore) {
                // we found the best path here
                neighbor.cameFrom = currentNode;
                neighbor.gScore = tentativeGScore;
                neighbor.hScore = heuristic(neighbor, endNode);
                neighbor.fScore = neighbor.gScore + neighbor.hScore;
            }
        }

        return null
    }

    function getPath() {
        const path = new Array<AStarNode>();

        let currentNode = getLowestFScoreOf(openSet)!;

        while (currentNode !== startNode) {
            path.push(currentNode);
            currentNode = currentNode.cameFrom!;
        }

        path.push(startNode);

        return path.reverse();
    }

    function init(newNodes: Set<ConnectedNode>, startPos: Vector, endPos: Vector) {
        nodes.clear();
        openSet.clear();
        closedSet.clear();

        for (const node of connectedNodesToAStarNodes(newNodes)) {
            nodes.add(node);
        }

        startNode = getNodeByPosition(nodes, startPos);
        if (!startNode) { throw new Error("Start node not found"); }
        endNode = getNodeByPosition(nodes, endPos);
        if (!endNode) { throw new Error("End node not found"); }

        openSet.add(startNode);
        startNode.gScore = 0;
    }

    return {
        init,
        step,
        getPath,
        nodes,
        startNode,
        endNode,
        openSet,
        closedSet,
    }
}