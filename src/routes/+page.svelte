<script lang="ts">
    import {createPathfinder} from "$lib/pathfinder-store";

    const { start, grid, path, openSet, closedSet, endNode } = createPathfinder()
</script>

<main class="p-6 flex flex-col gap-4">
    <section class="flex flex-row gap-2">
        <button on:click={start} class="text-md py-2 px-4 rounded-sm bg-neutral-200">start</button>
    </section>
    <section>
        <div class="flex flex-row gap-1">
            {#each $grid as col}
                <div class="flex flex-col gap-1">
                    {#each col as node}
                        <div
                            data-wall={node.wall}
                            data-open={$openSet.has(node)}
                            data-closed={$closedSet.has(node)}
                            data-path={$path.includes(node)}
                            data-end={node === $endNode}
                            class="w-4 h-4 rounded-sm flex justify-center items-center gap-1 bg-neutral-200 data-[wall=true]:bg-neutral-700 data-[open=true]:bg-green-400 data-[closed=true]:bg-rose-400 data-[end=true]:bg-amber-300 data-[path=true]:!bg-blue-400"
                        />
                    {/each}
                </div>
            {/each}
        </div>
    </section>
</main>