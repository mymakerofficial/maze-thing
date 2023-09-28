import {chooseRandom} from "$lib/utils";
import type {Node} from "$lib/astar";


export interface Point2 {
    x: number;
    y: number;
}

function createNode(x: number, y: number): Node {
    return {
        x,
        y,
        neighbors: new Set<Node>(),
        gScore: Infinity,
        hScore: 0,
        fScore: 0,
        cameFrom: null,
    }
}

function connectNodes(a: Node, b: Node) {
    a.neighbors.add(b);
    b.neighbors.add(a);
}

function randomInRadius(center: Point2, radius: number): Point2 {
    const angle = Math.random() * 2 * Math.PI;

    const x = Math.round(center.x + Math.cos(angle) * radius);
    const y = Math.round(center.y + Math.sin(angle) * radius);

    return {x, y};
}

// generate a set of nodes in the approximate shape of cities
export function createCity() {
    const nodes = new Set<Node>();

    const cityCenterSet = new Set<Node>();
    const highwayPointSet = new Set<Node>();
    const roadPointSet = new Set<Node>();

    const highwayPointCount = 3;
    const roadPointCount = 3;

    function step() {
        // choose a random node from the city center set
        const cityCenter = chooseRandom(cityCenterSet);

        // create highway points around the city center
        for (let i = 0; i < highwayPointCount; i++) {
            const point = randomInRadius(cityCenter, 6);

            const highwayPoint = createNode(point.x, point.y);
            nodes.add(highwayPoint);
            highwayPointSet.add(highwayPoint);

            connectNodes(cityCenter, highwayPoint);

            // create road points around the highway points
            for (let i = 0; i < roadPointCount; i++) {
                const point = randomInRadius(highwayPoint, 2);

                const roadPoint = createNode(point.x, point.y);
                nodes.add(roadPoint);
                roadPointSet.add(roadPoint);

                connectNodes(highwayPoint, roadPoint);
            }
        }
    }

    function init() {
        nodes.clear();

        const initNode = createNode(0, 0);

        nodes.add(initNode);
        cityCenterSet.add(initNode);
    }

    return {
        step,
        init,
        nodes,
    }
}