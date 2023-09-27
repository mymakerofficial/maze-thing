<script lang="ts">
    import {createPathfinder} from "$lib/pathfinder-store";

    const { step, grid, path, openSet, closedSet, endNode } = createPathfinder()
</script>

<main class="p-6 flex flex-col gap-4">
    <section class="flex flex-row gap-2">
        <button on:click={step} class="text-md py-2 px-4 rounded-sm bg-neutral-200">step</button>
    </section>
    <section>
        <div class="flex flex-row gap-2">
            {#each $grid as col}
                <div class="flex flex-col gap-2">
                    {#each col as node}
                        <div
                            data-open={$openSet.has(node)}
                            data-closed={$closedSet.has(node)}
                            data-path={$path.includes(node)}
                            data-end={node === $endNode}
                            class="w-12 h-12 rounded-sm flex justify-center items-center gap-1 bg-neutral-200 data-[open=true]:bg-green-400 data-[closed=true]:bg-rose-400 data-[end=true]:bg-amber-300 data-[path=true]:!bg-blue-400"
                        >
                            {#if node.gScore !== Infinity}
                                <div>
                                    { node.gScore }
                                </div>
                            {/if}
                            {#if node.cameFrom != null}
                                <div>
                                    {#if node.cameFrom.x < node.x}
                                        🡄
                                    {:else if node.cameFrom.x > node.x}
                                        🡆
                                    {:else if node.cameFrom.y < node.y}
                                        🡅
                                    {:else if node.cameFrom.y > node.y}
                                        🡇
                                    {/if}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </section>
</main>