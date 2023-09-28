<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let primary: boolean = false;

    const dispatch = createEventDispatcher();

    function click(e: MouseEvent) {
        dispatch('click', e);
    }
</script>

<button on:click={click} data-primary={primary} class="text-md py-2 px-4 rounded-sm bg-neutral-200 data-[primary=true]:bg-purple-200 data-[primary=true]:text-purple-900">
    <slot />
</button>