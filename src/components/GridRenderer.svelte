<script lang="ts">
    import type {Grid, GridCell} from "$lib/models/grid.js";

    export let grid: Grid;
    export let getRed: (cell: GridCell) => boolean = () => false;
    export let getGreen: (cell: GridCell) => boolean = () => false;
    export let getBlue: (cell: GridCell) => boolean = () => false;
    export let getYellow: (cell: GridCell) => boolean = () => false;
    export let getPurple: (cell: GridCell) => boolean = () => false;
    export let getLightPurple: (cell: GridCell) => boolean = () => false;
    export let getBlack: (cell: GridCell) => boolean = () => false;

    function getColor(cell: GridCell) {
        if (getBlue(cell)) {
            return "blue";
        } else if (getRed(cell)) {
            return "red";
        } else if (getGreen(cell)) {
            return "green";
        } else if (getYellow(cell)) {
            return "yellow";
        } else if (getPurple(cell)) {
            return "purple";
        } else if (getLightPurple(cell)) {
            return "light-purple";
        } else if (getBlack(cell)) {
            return "black";
        }
    }
</script>

<div class="flex flex-row">
    {#each grid as col}
        <div class="flex flex-col">
            {#each col as cell}
                <div
                    data-color={getColor(cell)}
                    class="relative w-4 h-4 flex justify-center items-center gap-1 bg-neutral-100 text-neutral-700 data-[color=red]:bg-rose-400 data-[color=red]:text-rose-700 data-[color=green]:bg-green-400 data-[color=green]:text-green-700 data-[color=blue]:bg-blue-400 data-[color=blue]:text-blue-700 data-[color=yellow]:bg-amber-300 data-[color=yellow]:text-amber-700 data-[color=purple]:bg-purple-500 data-[color=purple]:text-purple-900 data-[color=light-purple]:bg-purple-300 data-[color=light-purple]:text-purple-900 data-[color=black]:bg-neutral-600 data-[color=black]:text-neutral-900"
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