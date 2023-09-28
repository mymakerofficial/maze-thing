<script lang="ts">
    import {createMaze} from "$lib/maze-store";
    import {onMount} from "svelte";

    const { start, stop, step, reset, done, grid, stack, visitedSet } = createMaze()

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
            visited: {$visitedSet.size}
        </div>
        <div>
            stack size: {$stack.length}
        </div>
    </section>
    <section>
        <div class="flex flex-row">
            {#each $grid as col}
                <div class="flex flex-col">
                    {#each col as cell}
                        <div
                            data-visited={$visitedSet.has(cell)}
                            data-stack={$stack.includes(cell)}
                            class="relative w-4 h-4 flex justify-center items-center gap-1 bg-neutral-100 data-[visited=true]:bg-purple-300 data-[stack=true]:!bg-purple-500"
                        >
                            <span data-visited={$visitedSet.has(cell)} data-active={cell.wallTop} class="absolute w-full h-full data-[active=true]:border-t border-neutral-700 data-[visited=true]:border-purple-900" />
                            <span data-visited={$visitedSet.has(cell)} data-active={cell.wallRight} class="absolute w-full h-full data-[active=true]:border-r border-neutral-700 data-[visited=true]:border-purple-900" />
                            <span data-visited={$visitedSet.has(cell)} data-active={cell.wallBottom} class="absolute w-full h-full data-[active=true]:border-b border-neutral-700 data-[visited=true]:border-purple-900" />
                            <span data-visited={$visitedSet.has(cell)} data-active={cell.wallLeft} class="absolute w-full h-full data-[active=true]:border-l border-neutral-700 data-[visited=true]:border-purple-900" />
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </section>
</main>