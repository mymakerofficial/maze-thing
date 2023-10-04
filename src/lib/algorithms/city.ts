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

    /***
     @returns true if the city is complete
     @returns false if the city is not complete
     */
    function step() {
        if (activeNodes.size === 0) {
            return true;
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
            return false;
        }

        if (currentNode.depth > currentNode.magnitude) {
            // this node is too deep, so we don't want to expand it anymore
            activeNodes.delete(currentNode);
            return false;
        }

        const currentAngle = angleBetween(chooseRandom(currentNode.neighbors), currentNode);

        if (currentNode.neighbors.size === 1) {
            if (closestLowerMagnitudeNode && euclideanDistance(currentNode, closestLowerMagnitudeNode) < currentNode.magnitude) {
                activeNodes.delete(currentNode);
                connectNodes(currentNode, closestLowerMagnitudeNode);
                return false;
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
            return false;
        }

        if (currentNode.neighbors.size > 4) {
            // this node has too many neighbors, so we don't want to expand it anymore
            activeNodes.delete(currentNode);
            return false;
        }

        if (nextLowerMagnitude < 1) {
            // this node is too small, so we don't want to expand it anymore
            activeNodes.delete(currentNode);
            return false;
        }

        if (closestLowerMagnitudeNode && euclideanDistance(currentNode, closestLowerMagnitudeNode) < currentNode.magnitude) {
            // this node is too close to another node with a lower magnitude, so we dont want to expand it anymore
            activeNodes.delete(currentNode);
            return false;
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

    return {
        step,
        init,
        nodes,
        activeNodes,
    }
}