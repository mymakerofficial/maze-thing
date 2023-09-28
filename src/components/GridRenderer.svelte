<script lang="ts">
    import type {Cell, Grid} from "$lib/grid";

    export let grid: Grid;
    export let getRed: (cell: Cell) => boolean = () => false;
    export let getGreen: (cell: Cell) => boolean = () => false;
    export let getBlue: (cell: Cell) => boolean = () => false;
    export let getYellow: (cell: Cell) => boolean = () => false;
    export let getPurple: (cell: Cell) => boolean = () => false;
    export let getLightPurple: (cell: Cell) => boolean = () => false;
</script>

<div class="flex flex-row">
    {#each grid as col}
        <div class="flex flex-col">
            {#each col as cell}
                <div
                    data-red={getRed(cell)}
                    data-green={getGreen(cell)}
                    data-blue={getBlue(cell)}
                    data-yellow={getYellow(cell)}
                    data-purple={getPurple(cell)}
                    data-light-purple={getLightPurple(cell)}
                    class="relative w-4 h-4 flex justify-center items-center gap-1 bg-neutral-100 text-neutral-700 data-[red=true]:bg-rose-400 data-[red=true]:text-rose-700 data-[green=true]:bg-green-400 data-[green=true]:text-green-700 data-[blue=true]:!bg-blue-400 data-[blue=true]:!text-blue-700 data-[yellow=true]:bg-amber-300 data-[yellow=true]:text-amber-700 data-[purple=true]:!bg-purple-500 data-[purple=true]:text-purple-900 data-[light-purple=true]:bg-purple-300 data-[light-purple=true]:text-purple-900"
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