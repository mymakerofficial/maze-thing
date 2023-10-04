import type {CityNode} from "$lib/models/city-node";
import type {Nullable, Possible} from "$lib/models/types";
import {angleBetween, euclideanDistance} from "$lib/utils/vector-utils";
import {angleToVector, chooseRandom, randomAngle, randomBetween} from "$lib/utils/math-utils";
import {createCityNode} from "$lib/models/city-node";
import {connectNodes} from "$lib/utils/node-utils";

function findClosestNode(nodes: Set<CityNode>, node: CityNode): Nullable<CityNode> {
    let closestNode: Possible<CityNode>;
    let closestDistance = Infinity;

    for (const otherNode of nodes) {
        if (otherNode === node) {
            continue;
        }

        const dist = euclideanDistance(node, otherNode);

        if (dist < closestDistance) {
            closestNode = otherNode;
            closestDistance = dist;
        }
    }

    if (!closestNode) {
        return null
    }

    return closestNode;
}

// generate a set of nodes in the approximate shape of cities
export function createCity() {
    const nodes = new Set<CityNode>();

    const activeNodes = new Set<CityNode>(); // nodes that are currently being expanded

    function step() {
        if (activeNodes.size === 0) {
            return;
        }

        // select a random node from the active nodes
        const currentNode = chooseRandom(activeNodes);

        const nextLowerMagnitude = currentNode.magnitude / 2;
        const lowerMagnitudeNodes = new Set(Array.from(nodes).filter(node => node.magnitude <= nextLowerMagnitude));
        const closestLowerMagnitudeNode = findClosestNode(lowerMagnitudeNodes, currentNode);

        if (currentNode.neighbors.size === 0) {
            // this node has no connections, so we can expand it in any direction
            const vector = angleToVector(randomAngle(), currentNode.magnitude);
            const newNode = createCityNode({
                x: currentNode.x + vector.x,
                y: currentNode.y + vector.y,
                magnitude: currentNode.magnitude,
                depth: currentNode.depth + 1,
            });
            nodes.add(newNode);
            activeNodes.add(newNode);
            connectNodes(currentNode, newNode);
            return;
        }

        const currentAngle = angleBetween(chooseRandom(currentNode.neighbors), currentNode);

        if (currentNode.neighbors.size === 1) {

            if (closestLowerMagnitudeNode && euclideanDistance(currentNode, closestLowerMagnitudeNode) < currentNode.magnitude) {
                activeNodes.delete(currentNode);
                connectNodes(currentNode, closestLowerMagnitudeNode);
                return;
            }

            // this node has only one connection, so we expand it in the opposite direction
            const angle = currentAngle + randomBetween(-Math.PI / 8, Math.PI / 8);
            const vector = angleToVector(angle, currentNode.magnitude);
            const newNode = createCityNode({
                x: currentNode.x + vector.x,
                y: currentNode.y + vector.y,
                magnitude: currentNode.magnitude,
                depth: currentNode.depth + 1,
            });
            nodes.add(newNode);
            activeNodes.add(newNode);
            connectNodes(currentNode, newNode);
            return;
        }

        if (currentNode.neighbors.size > 4) {
            // this node has too many neighbors, so we don't want to expand it anymore
            activeNodes.delete(currentNode);
            return;
        }

        if (currentNode.depth > currentNode.magnitude / 2) {
            // this node is too deep, so we don't want to expand it anymore
            activeNodes.delete(currentNode);
            // we still want to continue it with a lower magnitude tho, so we continue with the next step
        }

        if (nextLowerMagnitude < 1) {
            // this node is too small, so we don't want to expand it anymore
            activeNodes.delete(currentNode);
            return;
        }

        if (closestLowerMagnitudeNode && euclideanDistance(currentNode, closestLowerMagnitudeNode) < currentNode.magnitude) {
            // this node is too close to another node with a lower magnitude, so we dont want to expand it anymore
            activeNodes.delete(currentNode);
            return;
        }

        // transition to lower magnitude

        const angle = currentAngle + ((Math.PI / 2) * (Math.round(Math.random()) ? 1 : -1));
        const vector = angleToVector(angle, nextLowerMagnitude);
        const newNode = createCityNode({
            x: currentNode.x + vector.x,
            y: currentNode.y + vector.y,
            magnitude: nextLowerMagnitude,
            depth: 0,
        });
        nodes.add(newNode);
        activeNodes.add(newNode);
        connectNodes(currentNode, newNode);

        // if (primaryNodes.has(currentNode)) {
        //     // check if closest secondary node is too close
        //     const closestSecondaryNode = findClosestNode(secondaryNodes, currentNode);
        //
        //     if (closestSecondaryNode && distance(currentNode, closestSecondaryNode) < 16) {
        //         // this node is too close to another secondary node, so we dont want to expand it anymore
        //         activeNodes.delete(currentNode);
        //         return;
        //     }
        //
        //     const angle = currentAngle + Math.PI / 2;
        //     const vector = angleToVector(angle, 4);
        //     const newNode = createNode(currentNode.x + vector.x, currentNode.y + vector.y);
        //     nodes.add(newNode);
        //     secondaryNodes.add(newNode);
        //     activeNodes.add(newNode);
        //     connectNodes(currentNode, newNode);
        // }
    }

    function init() {
        nodes.clear();

        const centerNode = createCityNode({
            x: 0,
            y: 0,
            magnitude: 8,
            depth: 0,
        });
        nodes.add(centerNode);
        activeNodes.add(centerNode);
    }

    // function getPathfindingNodes(): Set<Node> {
    //     const pathfindingNodes = new Set<Node>();
    //
    //     for (const node of nodes) {
    //         const pathfindingNode: Node = {
    //             x: node.x,
    //             y: node.y,
    //             neighbors: new Set(),
    //             gScore: Infinity,
    //             hScore: 0,
    //             fScore: 0,
    //             cameFrom: null,
    //         }
    //
    //         pathfindingNodes.add(pathfindingNode);
    //     }
    //
    //     for (const pathfindingNode of pathfindingNodes) {
    //         const roadNode = Array.from(nodes).find(n => n.x === pathfindingNode.x && n.y === pathfindingNode.y)!;
    //
    //         for (const connection of roadNode.neighbors) {
    //             const pathfindingNeighbor = Array.from(pathfindingNodes).find(n => n.x === connection.x && n.y === connection.y)!;
    //
    //             pathfindingNode.neighbors.add(pathfindingNeighbor);
    //         }
    //     }
    //
    //     return pathfindingNodes;
    // }

    return {
        step,
        init,
        nodes,
    }
}