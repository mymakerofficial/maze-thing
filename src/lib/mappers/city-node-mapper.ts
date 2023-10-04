import type {ConnectedNode} from "$lib/models/node";
import type {CityNode} from "$lib/models/city-node";
import { mapNodes } from "./node-mapper";
import {createCityNode} from "$lib/models/city-node";

export function connectedNodesToCityNodes(originalNodes: Set<ConnectedNode>): Set<CityNode> {
    return mapNodes(originalNodes, createCityNode);
}

export function cityNodesToConnectedNodes(originalNodes: Set<CityNode>): Set<ConnectedNode> {
    return mapNodes(originalNodes, createCityNode);
}