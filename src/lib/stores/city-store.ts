import { writable } from 'svelte/store';
import {createCity} from "$lib/algorithms/city";

export function createCityStore() {
    const city = createCity();

    const nodes = writable(city.nodes);

    const steps = writable(0);

    let interval: number | undefined;

    function setValues() {
        nodes.set(city.nodes);
    }

    function step() {
        city.step();

        steps.update(n => n + 1);
        setValues();
    }

    function start() {
        stop();
        interval = setInterval(() => {
            step();
        }, 1);
    }

    function stop() {
        if (interval === undefined) return;

        clearInterval(interval!);
    }

    function reset() {
        stop();
        city.init()
        setValues();
        steps.set(0);
    }

    return {
        start,
        stop,
        step,
        reset,
        steps,
        nodes,
    }
}