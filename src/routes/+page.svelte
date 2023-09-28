<script lang="ts">
    import {createPathfinder} from "$lib/pathfinder-store";
    import {nodeFromCell} from "$lib/grid-nodes";
    import {onMount} from "svelte";

    const { start, stop, step, reset, done, grid, nodes, path, openSet, closedSet, endNode } = createPathfinder()

    onMount(() => {
        reset();
    })
</script>

<main class="p-6 flex flex-col gap-4">
    <section class="flex flex-row gap-2">
        <button on:click={start} class="text-md py-2 px-4 rounded-sm bg-neutral-200">start</button>
        <button on:click={stop} class="text-md py-2 px-4 rounded-sm bg-neutral-200">stop</button>
        <button on:click={step} class="text-md py-2 px-4 rounded-sm bg-neutral-200">step</button>
        <button on:click={reset} class="text-md py-2 px-4 rounded-sm bg-neutral-200">reset</button>
    </section>
    <section class="flex flex-row gap-2">
        <div>
            done: {$done}
        </div>
        <div>
            nodes: {$nodes.size}
        </div>
        <div>
            open: {$openSet.size}
        </div>
        <div>
            closed: {$closedSet.size}
        </div>
    </section>
    <section>
        <h3 class="text-lg font-bold">grid view</h3>
        <div class="flex flex-row">
            {#each $grid as col}
                <div class="flex flex-col">
                    {#each col as cell}
                        <div
                            data-open={$openSet.has(nodeFromCell(cell, $nodes))}
                            data-closed={$closedSet.has(nodeFromCell(cell, $nodes))}
                            data-path={$path.includes(nodeFromCell(cell, $nodes))}
                            data-end={nodeFromCell(cell, $nodes) === $endNode}
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
</main>