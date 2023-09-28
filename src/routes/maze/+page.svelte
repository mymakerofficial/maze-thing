<script lang="ts">
    import {createMaze} from "$lib/maze-store";

    const { start, step, grid, stack, visitedSet } = createMaze()
</script>

<main class="p-6 flex flex-col gap-4">
    <section class="flex flex-row gap-2">
        <button on:click={start} class="text-md py-2 px-4 rounded-sm bg-neutral-200">start</button>
        <button on:click={step} class="text-md py-2 px-4 rounded-sm bg-neutral-200">step</button>
    </section>
    <section>
        <div class="flex flex-row">
            {#each $grid as col}
                <div class="flex flex-col">
                    {#each col as cell}
                        <div
                                data-visited={$visitedSet.has(cell)}
                                data-stack={$stack.includes(cell)}
                                class="relative w-4 h-4 flex justify-center items-center gap-1 bg-neutral-100 data-[visited=true]:bg-purple-400 data-[stack=true]:bg-purple-700"
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