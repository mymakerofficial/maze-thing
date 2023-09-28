<script lang="ts">
    import {createPathfinder} from "$lib/pathfinder-store";
    import {nodeFromCell} from "$lib/grid-nodes";
    import {onMount} from "svelte";
    import {createMaze} from "$lib/maze-store";
    import {gridHeight, gridWidth} from "$lib/utils";
    import {get} from "svelte/store";
    import GridRenderer from "../components/GridRenderer.svelte";
    import Button from "../components/Button.svelte";

    const {
        start: mazeStart,
        stop: mazeStop,
        step: mazeStep,
        reset: mazeReset,
        done: mazeDone,
        grid: mazeGrid,
        stack: mazeStack,
        visitedSet: mazeVisitedSet,
    } = createMaze()

    const {
        start: pathStart,
        stop: pathStop,
        step: pathStep,
        reset: pathReset,
        init: pathInit,
        done: pathDone,
        grid: pathGrid,
        nodes: pathNodes,
        path: pathPath,
        openSet: pathOpenSet,
        closedSet: pathClosedSet,
        endNode: pathEndNode,
    } = createPathfinder()

    function acceptMaze() {
        pathInit(get(mazeGrid), 0, 0, gridWidth(get(mazeGrid)) - 1, gridHeight(get(mazeGrid)) - 1);
    }

    onMount(() => {
        mazeReset();
        pathReset();
    })
</script>

<main class="p-6 flex flex-wrap gap-8">
    <section class="border-2 border-neutral-200 p-6 rounded-md flex flex-col gap-4">
        <h2 class="text-xl font-bold"><a href="/maze">Recursive Backtracking Maze Generation</a></h2>
        <section class="flex flex-row gap-2">
            <Button on:click={mazeStart}>start</Button>
            <Button on:click={mazeStop}>stop</Button>
            <Button on:click={mazeStep}>step</Button>
            <Button on:click={mazeReset}>reset</Button>
        </section>
        <section>
            <h3 class="mb-2 text-lg font-bold text-neutral-600">grid view</h3>
            <GridRenderer
                grid={$mazeGrid}
                getLightPurple={cell => $mazeVisitedSet.has(cell)}
                getPurple={cell => $mazeStack.includes(cell)}
            />
        </section>
        <section class="flex flex-row gap-2 px-4 py-2 bg-neutral-100 rounded-sm font-mono text-neutral-700">
            <div>done: {$mazeDone}</div>
            <div>visited: {$mazeVisitedSet.size}</div>
            <div>stack: {$mazeStack.length}</div>
        </section>
    </section>
    <section class="border-2 border-neutral-200 p-6 rounded-md flex flex-col gap-4">
        <h2 class="text-xl font-bold"><a href="/path">A* Pathfinding</a></h2>
        <section class="flex flex-row gap-2">
            <Button on:click={acceptMaze} primary>use maze</Button>
        </section>
        <section class="flex flex-row gap-2">
            <Button on:click={pathStart}>start</Button>
            <Button on:click={pathStop}>stop</Button>
            <Button on:click={pathStep}>step</Button>
            <Button on:click={pathReset}>clear</Button>
        </section>
        <section>
            <h3 class="mb-2 text-lg font-bold text-neutral-600">grid view</h3>
            <GridRenderer
                grid={$pathGrid}
                getRed={cell => $pathClosedSet.has(nodeFromCell(cell, $pathNodes))}
                getGreen={cell => $pathOpenSet.has(nodeFromCell(cell, $pathNodes))}
                getBlue={cell => $pathPath.includes(nodeFromCell(cell, $pathNodes))}
                getYellow={cell => nodeFromCell(cell, $pathNodes) === $pathEndNode}
            />
        </section>
        <section class="flex flex-row gap-2 px-4 py-2 bg-neutral-100 rounded-sm font-mono text-neutral-700">
            <div>done: {$pathDone}</div>
            <div>nodes: {$pathNodes.size}</div>
            <div>open: {$pathOpenSet.size}</div>
            <div>closed: {$pathClosedSet.size}</div>
        </section>
    </section>
</main>