import type {ConnectedNode} from "$lib/models/node";
import {getNodeByPosition, positionFromNode} from "$lib/utils/node-utils";
import type {Vector} from "$lib/models/vector";

export function mapNodes<T extends ConnectedNode, U extends ConnectedNode>(originalNodes: Set<T>, constructor: (node: Vector) => U): Set<U> {
    const newNodes = new Set<U>();

    // create new nodes without neighbors
    for (const node of originalNodes) {
        newNodes.add(constructor(positionFromNode(node)));
    }

    // add neighbors
    for (const newNode of newNodes) {
        // find the corresponding node in the original set
        const originalNode = getNodeByPosition(originalNodes, newNode)!;

        for (const originalNeighbor of originalNode.neighbors) {
            // find the corresponding neighbor in the new set
            const newNeighbor = getNodeByPosition(newNodes, originalNeighbor)!;

            newNode.neighbors.add(newNeighbor);
        }
    }

    return newNodes;
}