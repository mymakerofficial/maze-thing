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
    import {gridHeight, gridWidth} from "$lib/utils/grid-utils";
    import {compareVectors} from "$lib/utils/vector-utils.js";
    // import {createCityStore} from "$lib/city-store";

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

    // const {
    //     start: cityStart,
    //     stop: cityStop,
    //     step: cityStep,
    //     reset: cityReset,
    //     done: cityDone,
    //     nodes: cityNodes,
    // } = createCityStore()

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

    // function useCity() {
    //     const start = chooseRandom(get(cityNodes))
    //     const end = chooseRandom(get(cityNodes))
    //
    //     pathInit(get(cityNodes), start.x, start.y, end.x, end.y);
    // }

    // function useRandomGrid() {
    //     const grid = createRandomGrid(randomBetween(5, 40), randomBetween(5, 40))
    //
    //     pathInit(gridToNodes(grid), randomBetween(0, gridWidth(grid)), randomBetween(0, gridHeight(grid)), randomBetween(0, gridWidth(grid)), randomBetween(0, gridHeight(grid)));
    // }

    onMount(() => {
        mazeReset();
        // cityReset();
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
    <!-- <Card>
        <h2 class="text-xl font-bold">City Generation</h2>
        <section class="flex flex-row gap-2">
            <Button on:click={cityStart}>start</Button>
            <Button on:click={cityStop}>stop</Button>
            <Button on:click={cityStep}>step</Button>
            <Button on:click={cityReset}>reset</Button>
        </section>
        <section class="flex flex-row gap-2 px-4 py-2 bg-neutral-100 rounded-sm font-mono text-neutral-700">
            <div>done: {$cityDone}</div>
            <div>nodes: {$cityNodes.size}</div>
        </section>
        <section>
            <h3 class="mb-2 text-lg font-bold text-neutral-600">node view</h3>
            <NodeRenderer
                nodes={$cityNodes}
            />
        </section>
    </Card> -->
    <Card>
        <h2 class="text-xl font-bold"><a href="/path">A* Pathfinding</a></h2>
        <section class="flex flex-row gap-2">
            <Button on:click={useMaze} primary>use maze</Button>
            <!-- <Button on:click={useCity} primary>use city</Button> -->
            <!-- <Button on:click={useRandomGrid} primary>use random</Button> -->
        </section>
        <section class="flex flex-row gap-2">
            <Button on:click={pathStart}>start</Button>
            <Button on:click={pathStop}>stop</Button>
            <Button on:click={pathStep}>step</Button>
            <!-- <Button on:click={pathReset}>clear</Button> -->
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
            <!--<div>
                <h3 class="mb-2 text-lg font-bold text-neutral-600">grid view</h3>
                <GridRenderer
                    grid={$pathGrid}
                    getRed={cell => $pathClosedSet.has(nodeFromCell(cell, $pathNodes))}
                    getGreen={cell => $pathOpenSet.has(nodeFromCell(cell, $pathNodes))}
                    getBlue={cell => $pathPath.includes(nodeFromCell(cell, $pathNodes))}
                    getYellow={cell => nodeFromCell(cell, $pathNodes) === $pathEndNode}
                    getBlack={cell => cell.wallTop && cell.wallRight && cell.wallBottom && cell.wallLeft}
                />
            </div>-->
        </section>
    </Card>
</main>