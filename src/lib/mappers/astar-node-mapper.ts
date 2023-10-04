import type {AStarNode} from "$lib/models/a-star-node";
import type {ConnectedNode} from "$lib/models/node";
import {createAStarNode} from "$lib/models/a-star-node";
import {createNode} from "$lib/models/node";
import {mapNodes} from "$lib/mappers/node-mapper";

export function connectedNodesToAStarNodes(originalNodes: Set<ConnectedNode>): Set<AStarNode> {
    return mapNodes(originalNodes, createAStarNode);
}

export function aStarNodesToConnectedNodes(originalNodes: Set<AStarNode>): Set<ConnectedNode> {
    return mapNodes(originalNodes, createNode);
}