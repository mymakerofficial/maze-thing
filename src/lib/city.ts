// import {chooseRandom, randomFloatBetween} from "$lib/utils";
// import type {Node, Nullable} from "$lib/algorithms/astar";
//
// export interface Point2 {
//     x: number;
//     y: number;
// }
//
// export interface RoadNode extends Point2 {
//     magnitude: number;
//     depth: number;
//     connections: Set<RoadNode>;
// }
//
// function createNode(x: number, y: number, magnitude: number, depth: number): RoadNode {
//     return {
//         x,
//         y,
//         magnitude,
//         depth,
//         connections: new Set<RoadNode>(),
//     }
// }
//
// export function connectNodes(a: RoadNode, b: RoadNode) {
//     if (a === b) {
//         return
//     }
//
//     if (a.connections.has(b) || b.connections.has(a)) {
//         return
//     }
//
//     a.connections.add(b);
//     b.connections.add(a);
// }
//
// function distance(a: RoadNode, b: RoadNode): number {
//     return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
// }
//
// function findClosestNode(nodes: Set<RoadNode>, node: RoadNode): Nullable<RoadNode> {
//     let closestNode: RoadNode | undefined;
//     let closestDistance = Infinity;
//
//     for (const otherNode of nodes) {
//         if (otherNode === node) {
//             continue;
//         }
//
//         const dist = distance(node, otherNode);
//
//         if (dist < closestDistance) {
//             closestNode = otherNode;
//             closestDistance = dist;
//         }
//     }
//
//     if (!closestNode) {
//         return null
//     }
//
//     return closestNode;
// }
//
// function randomInRadius(center: Point2, radius: number): Point2 {
//     const angle = Math.random() * 2 * Math.PI;
//
//     const x = Math.round(center.x + Math.cos(angle) * radius);
//     const y = Math.round(center.y + Math.sin(angle) * radius);
//
//     return {x, y};
// }
//
// function randomAngle(): number {
//     return Math.random() * 2 * Math.PI;
// }
//
// // returns the angle between the two nodes in radians
// function angleBetween(a: RoadNode, b: RoadNode): number {
//     return Math.atan2(b.y - a.y, b.x - a.x);
// }
//
// function angleToVector(angle: number, magnitude: number = 1): Point2 {
//     return {
//         x: Math.cos(angle) * magnitude,
//         y: Math.sin(angle) * magnitude,
//     }
// }
//
// // generate a set of nodes in the approximate shape of cities
// export function createCity() {
//     const nodes = new Set<RoadNode>();
//
//     // const primaryNodes = new Set<RoadNode>(); // nodes that form corners of main roads
//     // const secondaryNodes = new Set<RoadNode>(); // nodes that form corners of access roads (roads that connect main roads to local roads)
//     // const tertiaryNodes = new Set<RoadNode>(); // nodes that form corners of local roads (roads that connect to houses)
//     // const leafNodes = new Set<RoadNode>(); // nodes that represent houses
//
//     const activeNodes = new Set<RoadNode>(); // nodes that are currently being expanded
//
//     function step() {
//         if (activeNodes.size === 0) {
//             return;
//         }
//
//         // select a random node from the active nodes
//         const currentNode = chooseRandom(activeNodes);
//
//         const nextLowerMagnitude = currentNode.magnitude / 2;
//         const lowerMagnitudeNodes = new Set(Array.from(nodes).filter(node => node.magnitude <= nextLowerMagnitude));
//         const closestLowerMagnitudeNode = findClosestNode(lowerMagnitudeNodes, currentNode);
//
//         if (currentNode.connections.size === 0) {
//             // this node has no connections, so we can expand it in any direction
//             const vector = angleToVector(randomAngle(), currentNode.magnitude);
//             const newNode = createNode(currentNode.x + vector.x, currentNode.y + vector.y, currentNode.magnitude, currentNode.depth + 1);
//             nodes.add(newNode);
//             activeNodes.add(newNode);
//             connectNodes(currentNode, newNode);
//             return;
//         }
//
//         const currentAngle = angleBetween(chooseRandom(currentNode.connections), currentNode);
//
//         if (currentNode.connections.size === 1) {
//
//             if (closestLowerMagnitudeNode && distance(currentNode, closestLowerMagnitudeNode) < currentNode.magnitude) {
//                 activeNodes.delete(currentNode);
//                 connectNodes(currentNode, closestLowerMagnitudeNode);
//                 return;
//             }
//
//             // this node has only one connection, so we expand it in the opposite direction
//             const angle = currentAngle + randomFloatBetween(-Math.PI / 8, Math.PI / 8);
//             const vector = angleToVector(angle, currentNode.magnitude);
//             const newNode = createNode(currentNode.x + vector.x, currentNode.y + vector.y, currentNode.magnitude, currentNode.depth + 1);
//             nodes.add(newNode);
//             activeNodes.add(newNode);
//             connectNodes(currentNode, newNode);
//             return;
//         }
//
//         if (currentNode.connections.size > 4) {
//             // this node has too many neighbors, so we dont want to expand it anymore
//             activeNodes.delete(currentNode);
//             return;
//         }
//
//         if (currentNode.depth > currentNode.magnitude / 2) {
//             // this node is too deep, so we dont want to expand it anymore
//             activeNodes.delete(currentNode);
//             // we still want to continue it with a lower magnitude tho, so we continue with the next step
//         }
//
//         if (nextLowerMagnitude < 1) {
//             // this node is too small, so we dont want to expand it anymore
//             activeNodes.delete(currentNode);
//             return;
//         }
//
//         if (closestLowerMagnitudeNode && distance(currentNode, closestLowerMagnitudeNode) < currentNode.magnitude) {
//             // this node is too close to another node with a lower magnitude, so we dont want to expand it anymore
//             activeNodes.delete(currentNode);
//             return;
//         }
//
//         // transition to lower magnitude
//
//         const angle = currentAngle + ((Math.PI / 2) * (Math.round(Math.random()) ? 1 : -1));
//         const vector = angleToVector(angle, nextLowerMagnitude);
//         const newNode = createNode(currentNode.x + vector.x, currentNode.y + vector.y, nextLowerMagnitude, 0);
//         nodes.add(newNode);
//         activeNodes.add(newNode);
//         connectNodes(currentNode, newNode);
//
//         // if (primaryNodes.has(currentNode)) {
//         //     // check if closest secondary node is too close
//         //     const closestSecondaryNode = findClosestNode(secondaryNodes, currentNode);
//         //
//         //     if (closestSecondaryNode && distance(currentNode, closestSecondaryNode) < 16) {
//         //         // this node is too close to another secondary node, so we dont want to expand it anymore
//         //         activeNodes.delete(currentNode);
//         //         return;
//         //     }
//         //
//         //     const angle = currentAngle + Math.PI / 2;
//         //     const vector = angleToVector(angle, 4);
//         //     const newNode = createNode(currentNode.x + vector.x, currentNode.y + vector.y);
//         //     nodes.add(newNode);
//         //     secondaryNodes.add(newNode);
//         //     activeNodes.add(newNode);
//         //     connectNodes(currentNode, newNode);
//         // }
//     }
//
//     function init() {
//         nodes.clear();
//
//         const centerNode = createNode(0, 0, 8, 0);
//         nodes.add(centerNode);
//         activeNodes.add(centerNode);
//     }
//
//     function getPathfindingNodes(): Set<Node> {
//         const pathfindingNodes = new Set<Node>();
//
//         for (const node of nodes) {
//             const pathfindingNode: Node = {
//                 x: node.x,
//                 y: node.y,
//                 neighbors: new Set(),
//                 gScore: Infinity,
//                 hScore: 0,
//                 fScore: 0,
//                 cameFrom: null,
//             }
//
//             pathfindingNodes.add(pathfindingNode);
//         }
//
//         for (const pathfindingNode of pathfindingNodes) {
//             const roadNode = Array.from(nodes).find(n => n.x === pathfindingNode.x && n.y === pathfindingNode.y)!;
//
//             for (const connection of roadNode.connections) {
//                 const pathfindingNeighbor = Array.from(pathfindingNodes).find(n => n.x === connection.x && n.y === connection.y)!;
//
//                 pathfindingNode.neighbors.add(pathfindingNeighbor);
//             }
//         }
//
//         return pathfindingNodes;
//     }
//
//     return {
//         step,
//         init,
//         nodes,
//         getPathfindingNodes,
//     }
// }