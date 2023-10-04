import type {Grid} from "$lib/models/grid";
import type {ConnectedNode} from "$lib/models/node";
import {createNode} from "$lib/models/node";
import {positionFromCell} from "$lib/utils/grid-utils";
import {addVectors, DOWN, LEFT, RIGHT, UP} from "$lib/utils/vector-utils";
import {getCellByPosition} from "$lib/utils/grid-utils";
import {getNodeByPosition} from "$lib/utils/node-utils";

export function gridToConnectedNodes(grid: Grid): Set<ConnectedNode> {
    const nodes = new Set<ConnectedNode>();

    for (const row of grid) {
        for (const cell of row) {
            if (cell) {
                nodes.add(createNode(positionFromCell(cell)));
            }
        }
    }

    nodes.forEach((node) => {
        const cell = getCellByPosition(grid, node)!;

        const top = getNodeByPosition(nodes, addVectors(node, UP));
        const right = getNodeByPosition(nodes, addVectors(node, RIGHT));
        const bottom = getNodeByPosition(nodes, addVectors(node, DOWN));
        const left = getNodeByPosition(nodes, addVectors(node, LEFT));

        if (top && !cell.wallTop) {
            node.neighbors.add(top);
        }
        if (right && !cell.wallRight) {
            node.neighbors.add(right);
        }
        if (bottom && !cell.wallBottom) {
            node.neighbors.add(bottom);
        }
        if (left && !cell.wallLeft) {
            node.neighbors.add(left);
        }
    });

    return nodes;
}

export function connectedNodesToGrid() {
    throw new Error("Not implemented")
}