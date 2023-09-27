<script lang="ts">
    import {createPathfinder} from "$lib/pathfinder-store";
    import {nodeFromCell} from "$lib/grid-nodes";

    const { start, grid, nodes, path, openSet, closedSet, endNode } = createPathfinder()
</script>

<main class="p-6 flex flex-col gap-4">
    <section class="flex flex-row gap-2">
        <button on:click={start} class="text-md py-2 px-4 rounded-sm bg-neutral-200">start</button>
    </section>
    <section>
        <div class="flex flex-row">
            {#each $grid as col}
                <div class="flex flex-col">
                    {#each col as cell}
                        <div
                            data-open={$openSet.has(nodeFromCell(cell, $nodes))}
                            data-closed={$closedSet.has(nodeFromCell(cell, $nodes))}
                            data-path={$path.includes(nodeFromCell(cell, $nodes))}
                            data-end={nodeFromCell(cell, $nodes) === $endNode}
                            class="relative w-4 h-4 flex justify-center items-center gap-1 bg-neutral-100 data-[wall=true]:bg-neutral-700 data-[open=true]:bg-green-400 data-[closed=true]:bg-rose-400 data-[end=true]:bg-amber-300 data-[path=true]:!bg-blue-400"
                        >
                            <span data-active={cell.wallTop} class="absolute w-full h-full border-t-2 border-transparent data-[active=true]:border-neutral-700" />
                            <span data-active={cell.wallRight} class="absolute w-full h-full border-r-2 border-transparent data-[active=true]:border-neutral-700" />
                            <span data-active={cell.wallBottom} class="absolute w-full h-full border-b-2 border-transparent data-[active=true]:border-neutral-700" />
                            <span data-active={cell.wallLeft} class="absolute w-full h-full border-l-2 border-transparent data-[active=true]:border-neutral-700" />
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </section>
</main>