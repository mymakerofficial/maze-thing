<script lang="ts">
    import {createPathfinder} from "$lib/pathfinder-store";
    import {nodeFromCell, nodesToGrid} from "$lib/grid-nodes";
    import {onMount} from "svelte";
    import {createMaze} from "$lib/maze-store";
    import {chooseRandom, gridHeight, gridWidth, randomBetween} from "$lib/utils";
    import {get} from "svelte/store";
    import GridRenderer from "../components/GridRenderer.svelte";
    import Button from "../components/Button.svelte";
    import NodeRenderer from "../components/NodeRenderer.svelte";
    import Card from "../components/Card.svelte";
    import {createCity} from "$lib/city";
    import {gridToNodes} from "$lib/grid-nodes.js";
    import {createRandomGrid} from "$lib/grid";

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
        pathInit(gridToNodes(get(mazeGrid)), 0, 0, gridWidth(get(mazeGrid)) - 1, gridHeight(get(mazeGrid)) - 1);
    }

    function useCity() {
        const city = createCity();
        city.init()
        city.step()

        console.log(city.nodes, nodesToGrid(city.nodes))

        const target = chooseRandom(city.nodes)

        pathInit(city.nodes, 0, 0, target.x, target.y);
    }

    function useRandomGrid() {
        const grid = createRandomGrid(randomBetween(5, 40), randomBetween(5, 40))

        pathInit(gridToNodes(grid), randomBetween(0, gridWidth(grid)), randomBetween(0, gridHeight(grid)), randomBetween(0, gridWidth(grid)), gridWidth(grid) - 1);
    }

    onMount(() => {
        mazeReset();
        pathReset();
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
        <h2 class="text-xl font-bold"><a href="/path">A* Pathfinding</a></h2>
        <section class="flex flex-row gap-2">
            <Button on:click={acceptMaze} primary>use maze</Button>
            <Button on:click={useCity} primary>use city</Button>
            <Button on:click={useRandomGrid} primary>use random</Button>
        </section>
        <section class="flex flex-row gap-2">
            <Button on:click={pathStart}>start</Button>
            <Button on:click={pathStop}>stop</Button>
            <Button on:click={pathStep}>step</Button>
            <Button on:click={pathReset}>clear</Button>
        </section>
        <section class="flex flex-row gap-2 px-4 py-2 bg-neutral-100 rounded-sm font-mono text-neutral-700">
            <div>done: {$pathDone}</div>
            <div>nodes: {$pathNodes.size}</div>
            <div>open: {$pathOpenSet.size}</div>
            <div>closed: {$pathClosedSet.size}</div>
        </section>
        <section class="flex flex-col gap-6">
            <div>
                <h3 class="mb-2 text-lg font-bold text-neutral-600">grid view</h3>
                <GridRenderer
                    grid={$pathGrid}
                    getRed={cell => $pathClosedSet.has(nodeFromCell(cell, $pathNodes))}
                    getGreen={cell => $pathOpenSet.has(nodeFromCell(cell, $pathNodes))}
                    getBlue={cell => $pathPath.includes(nodeFromCell(cell, $pathNodes))}
                    getYellow={cell => nodeFromCell(cell, $pathNodes) === $pathEndNode}
                    getBlack={cell => cell.wallTop && cell.wallRight && cell.wallBottom && cell.wallLeft}
                />
            </div>
            <div>
                <h3 class="mb-2 text-lg font-bold text-neutral-600">node view</h3>
                <NodeRenderer
                    nodes={$pathNodes}
                    getRed={node => $pathClosedSet.has(node)}
                    getGreen={node => $pathOpenSet.has(node)}
                    getBlue={node => $pathPath.includes(node)}
                    getYellow={node => node === $pathEndNode}
                />
            </div>
        </section>
    </Card>
</main>