<script lang="ts">
    import {createAStarStore} from "$lib/stores/astar-store";
    import {onMount} from "svelte";
    import {createMaze} from "$lib/stores/maze-store";
    import {get} from "svelte/store";
    import GridRenderer from "../components/GridRenderer.svelte";
    import Button from "../components/Button.svelte";
    import NodeRenderer from "../components/NodeRenderer.svelte";
    import Card from "../components/Card.svelte";
    import {gridToConnectedNodes} from "$lib/mappers/grid-node-mapper";
    import {NULL_VECTOR} from "$lib/utils/vector-utils";
    import {createVector} from "$lib/models/vector";
    import {
        getNeighbors,
        gridHeight,
        gridWidth,
        positionFromCell,
        randomCellIn,
        setWallsBetween
    } from "$lib/utils/grid-utils";
    import {compareVectors} from "$lib/utils/vector-utils.js";
    import {createCityStore} from "$lib/stores/city-store";
    import {chooseRandom} from "$lib/utils/math-utils";
    import {positionFromNode} from "$lib/utils/node-utils.js";
    import {cityNodesToConnectedNodes} from "$lib/mappers/city-node-mapper.js";
    import {createGrid} from "$lib/models/grid";
    import {randomIntBetween} from "$lib/utils/math-utils.js";

    const {
        start: mazeStart,
        stop: mazeStop,
        step: mazeStep,
        reset: mazeReset,
        steps: mazeSteps,
        done: mazeDone,
        grid: mazeGrid,
        stack: mazeStack,
        visitedSet: mazeVisitedSet,
    } = createMaze()

    const {
        start: cityStart,
        stop: cityStop,
        step: cityStep,
        reset: cityReset,
        steps: citySteps,
        done: cityDone,
        nodes: cityNodes,
        activeNodes: cityActiveNodes,
    } = createCityStore()

    const {
        start: pathStart,
        stop: pathStop,
        step: pathStep,
        init: pathInit,
        steps: pathSteps,
        done: pathDone,
        nodes: pathNodes,
        path: pathPath,
        openSet: pathOpenSet,
        closedSet: pathClosedSet,
        endNode: pathEndNode,
    } = createAStarStore()

    function useMaze() {
        pathInit(gridToConnectedNodes(get(mazeGrid)), NULL_VECTOR, createVector(gridWidth(get(mazeGrid)) - 1, gridHeight(get(mazeGrid)) - 1));
    }

    function useCity() {
        const start = positionFromNode(chooseRandom(get(cityNodes)))
        const end = positionFromNode(chooseRandom(get(cityNodes)))

        pathInit(cityNodesToConnectedNodes(get(cityNodes)), start, end);
    }

    function useRandomGrid() {
        const grid = createGrid(randomIntBetween(5, 40), randomIntBetween(5, 40), false)

        for (let i = 0; i < gridWidth(grid) * gridHeight(grid); i++) {
            const cell = randomCellIn(grid)
            const neighbors = getNeighbors(grid, cell)
            const neighbor = chooseRandom(neighbors)

            if (neighbor) {
                setWallsBetween(cell, neighbor, true)
            }
        }

        pathInit(gridToConnectedNodes(grid), positionFromCell(randomCellIn(grid)), positionFromCell(randomCellIn(grid)));
    }

    onMount(() => {
        mazeReset();
        cityReset();

        useRandomGrid();
    })
</script>

<main class="p-6 flex flex-wrap gap-8">
    <Card>
        <h2 class="text-xl font-bold"><a href="/maze">Recursive Backtracking Maze Generation</a></h2>
        <section class="flex flex-row gap-2">
            <Button on:click={mazeStart}>start</Button>
            <Button on:click={mazeStop}>stop</Button>
            <Button on:click={mazeStep}>step</Button>
            <Button on:click={mazeReset}>reset</Button>
        </section>
        <section class="flex flex-row gap-2 px-4 py-2 bg-neutral-100 rounded-sm font-mono text-neutral-700">
            <div>done: {$mazeDone}</div>
            <div>steps: {$mazeSteps}</div>
            <div>visited: {$mazeVisitedSet.size}</div>
            <div>stack: {$mazeStack.length}</div>
        </section>
        <section>
            <h3 class="mb-2 text-lg font-bold text-neutral-600">grid view</h3>
            <GridRenderer
                grid={$mazeGrid}
                getLightPurple={cell => $mazeVisitedSet.has(cell)}
                getPurple={cell => $mazeStack.includes(cell)}
            />
        </section>
    </Card>
    <Card>
        <h2 class="text-xl font-bold">City Generation</h2>
        <section class="flex flex-row gap-2">
            <Button on:click={cityStart}>start</Button>
            <Button on:click={cityStop}>stop</Button>
            <Button on:click={cityStep}>step</Button>
            <Button on:click={cityReset}>reset</Button>
        </section>
        <section class="flex flex-row gap-2 px-4 py-2 bg-neutral-100 rounded-sm font-mono text-neutral-700">
            <div>done: {$cityDone}</div>
            <div>steps: {$citySteps}</div>
            <div>nodes: {$cityNodes.size}</div>
            <div>active: {$cityActiveNodes.size}</div>
        </section>
        <section>
            <h3 class="mb-2 text-lg font-bold text-neutral-600">node view</h3>
            <NodeRenderer
                nodes={$cityNodes}
                getRed={node => $cityActiveNodes.has(node)}
            />
        </section>
    </Card>
    <Card>
        <h2 class="text-xl font-bold"><a href="/path">A* Pathfinding</a></h2>
        <section class="flex flex-row gap-2">
            <Button on:click={useMaze} primary>use maze</Button>
            <Button on:click={useCity} primary>use city</Button>
            <Button on:click={useRandomGrid} primary>use random</Button>
        </section>
        <section class="flex flex-row gap-2">
            <Button on:click={pathStart}>start</Button>
            <Button on:click={pathStop}>stop</Button>
            <Button on:click={pathStep}>step</Button>
        </section>
        <section class="flex flex-row gap-2 px-4 py-2 bg-neutral-100 rounded-sm font-mono text-neutral-700">
            <div>done: {$pathDone}</div>
            <div>steps: {$pathSteps}</div>
            <div>nodes: {$pathNodes.size}</div>
            <div>open: {$pathOpenSet.size}</div>
            <div>closed: {$pathClosedSet.size}</div>
        </section>
        <section class="flex flex-row gap-6">
            <div>
                <h3 class="mb-2 text-lg font-bold text-neutral-600">node view</h3>
                <NodeRenderer
                    nodes={$pathNodes}
                    getRed={node => $pathClosedSet.has(node)}
                    getGreen={node => $pathOpenSet.has(node)}
                    getBlue={node => $pathPath.includes(node)}
                    getYellow={node => compareVectors(node, $pathEndNode)}
                    getArrowBlue={(a, b) => $pathPath.includes(a) && $pathPath.includes(b)}
                    getArrowRed={(a, b) => $pathClosedSet.has(a) && $pathClosedSet.has(b)}
                />
            </div>
        </section>
    </Card>
</main>