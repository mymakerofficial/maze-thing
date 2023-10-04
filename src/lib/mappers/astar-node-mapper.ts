import type {AstarNode} from "$lib/models/astar-node";
import type {ConnectedNode} from "$lib/models/node";
import {createAstarNode} from "$lib/models/astar-node";
import {createNode} from "$lib/models/node";
import {mapNodes} from "$lib/mappers/node-mapper";

export function connectedNodesToAstarNodes(originalNodes: Set<ConnectedNode>): Set<AstarNode> {
    return mapNodes(originalNodes, createAstarNode);
}

export function astarNodesToConnectedNodes(originalNodes: Set<AstarNode>): Set<ConnectedNode> {
    return mapNodes(originalNodes, createNode);
}