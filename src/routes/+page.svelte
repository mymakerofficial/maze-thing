<script lang="ts">
    import {createPathfinder} from "$lib/pathfinder-store";
    import {nodeFromCell} from "$lib/grid-nodes";
    import {onMount} from "svelte";
    import {createMaze} from "$lib/maze-store";
    import {gridHeight, gridWidth} from "$lib/utils";
    import {get} from "svelte/store";

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

<main class="p-6 flex flex-row gap-8">
    <section class="border-2 border-neutral-200 p-6 rounded-md flex flex-col gap-4">
        <h2 class="text-xl font-bold"><a href="/maze">Recursive Backtracking Maze Generation</a></h2>
        <section class="flex flex-row gap-2">
            <button on:click={mazeStart} class="text-md py-2 px-4 rounded-sm bg-neutral-200">start</button>
            <button on:click={mazeStop} class="text-md py-2 px-4 rounded-sm bg-neutral-200">stop</button>
            <button on:click={mazeStep} class="text-md py-2 px-4 rounded-sm bg-neutral-200">step</button>
            <button on:click={mazeReset} class="text-md py-2 px-4 rounded-sm bg-neutral-200">reset</button>
        </section>
        <section class="flex flex-row gap-2">
            <div>
                done: {$mazeDone}
            </div>
            <div>
                visited: {$mazeVisitedSet.size}
            </div>
            <div>
                stack size: {$mazeStack.length}
            </div>
        </section>
        <section>
            <h3 class="text-lg font-bold">grid view</h3>
            <div class="flex flex-row">
                {#each $mazeGrid as col}
                    <div class="flex flex-col">
                        {#each col as cell}
                            <div
                                data-visited={$mazeVisitedSet.has(cell)}
                                data-stack={$mazeStack.includes(cell)}
                                class="relative w-4 h-4 flex justify-center items-center gap-1 bg-neutral-100 data-[visited=true]:bg-purple-300 data-[stack=true]:!bg-purple-500"
                            >
                                <span data-visited={$mazeVisitedSet.has(cell)} data-active={cell.wallTop} class="absolute w-full h-full data-[active=true]:border-t border-neutral-700 data-[visited=true]:border-purple-900" />
                                <span data-visited={$mazeVisitedSet.has(cell)} data-active={cell.wallRight} class="absolute w-full h-full data-[active=true]:border-r border-neutral-700 data-[visited=true]:border-purple-900" />
                                <span data-visited={$mazeVisitedSet.has(cell)} data-active={cell.wallBottom} class="absolute w-full h-full data-[active=true]:border-b border-neutral-700 data-[visited=true]:border-purple-900" />
                                <span data-visited={$mazeVisitedSet.has(cell)} data-active={cell.wallLeft} class="absolute w-full h-full data-[active=true]:border-l border-neutral-700 data-[visited=true]:border-purple-900" />
                            </div>
                        {/each}
                    </div>
                {/each}
            </div>
        </section>
    </section>
    <section class="border-2 border-neutral-200 p-6 rounded-md flex flex-col gap-4">
        <h2 class="text-xl font-bold"><a href="/path">A* Pathfinding</a></h2>
        <section class="flex flex-row gap-2">
            <button on:click={pathStart} class="text-md py-2 px-4 rounded-sm bg-neutral-200">start</button>
            <button on:click={pathStop} class="text-md py-2 px-4 rounded-sm bg-neutral-200">stop</button>
            <button on:click={pathStep} class="text-md py-2 px-4 rounded-sm bg-neutral-200">step</button>
            <button on:click={pathReset} class="text-md py-2 px-4 rounded-sm bg-neutral-200">reset</button>
            <button on:click={acceptMaze} class="text-md py-2 px-4 rounded-sm bg-purple-200 text-purple-900">accept maze</button>
        </section>
        <section class="flex flex-row gap-2">
            <div>
                done: {$pathDone}
            </div>
            <div>
                nodes: {$pathNodes.size}
            </div>
            <div>
                open: {$pathOpenSet.size}
            </div>
            <div>
                closed: {$pathClosedSet.size}
            </div>
        </section>
        <section>
            <h3 class="text-lg font-bold">grid view</h3>
            <div class="flex flex-row">
                {#each $pathGrid as col}
                    <div class="flex flex-col">
                        {#each col as cell}
                            <div
                                data-open={$pathOpenSet.has(nodeFromCell(cell, $pathNodes))}
                                data-closed={$pathClosedSet.has(nodeFromCell(cell, $pathNodes))}
                                data-path={$pathPath.includes(nodeFromCell(cell, $pathNodes))}
                                data-end={nodeFromCell(cell, $pathNodes) === $pathEndNode}
                                class="relative w-4 h-4 flex justify-center items-center gap-1 bg-neutral-100 text-neutral-700 data-[open=true]:bg-green-400 data-[open=true]:text-green-700 data-[closed=true]:bg-rose-400 data-[closed=true]:text-rose-700 data-[end=true]:bg-amber-300 data-[end=true]:text-amber-700 data-[path=true]:!bg-blue-400 data-[path=true]:text-blue-700"
                            >
                                <span data-active={cell.wallTop} class="absolute w-full h-full data-[active=true]:border-t border-current" />
                                <span data-active={cell.wallRight} class="absolute w-full h-full data-[active=true]:border-r border-current" />
                                <span data-active={cell.wallBottom} class="absolute w-full h-full data-[active=true]:border-b border-current" />
                                <span data-active={cell.wallLeft} class="absolute w-full h-full data-[active=true]:border-l border-current" />
                            </div>
                        {/each}
                    </div>
                {/each}
            </div>
        </section>
    </section>
</main>