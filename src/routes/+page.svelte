<script lang="ts">
    import {createNode, createPathfinder} from "$lib";
    import type {Node} from "$lib";
    import type {Grid} from "$lib";

    let grid = new Array<Array<Node>>(10) as Grid;

    for (let x = 0; x < grid.length; x++) {
        grid[x] = new Array<Node>(10);

        for (let y = 0; y < grid[x].length; y++) {
            grid[x][y] = createNode(x, y);
        }
    }

    let path = new Array<Node>();

    const pathfinder = createPathfinder(grid, 3, 3, 6, 8);

    function step () {
        const res = pathfinder.step();
        grid = pathfinder.grid
        if (res) {
            path = pathfinder.getPath();
        }
    }
</script>

<main class="p-6 flex flex-col gap-4">
    <section class="flex flex-row gap-2">
        <button on:click={step} class="text-md py-2 px-4 rounded-sm bg-neutral-200">step</button>
    </section>
    <section>
        <div class="flex flex-row gap-2">
            {#each grid as col}
                <div class="flex flex-col gap-2">
                    {#each col as node}
                        <div
                            data-open={node.open}
                            data-closed={node.closed}
                            data-path={path.includes(node)}
                            data-end={node === pathfinder.endNode}
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