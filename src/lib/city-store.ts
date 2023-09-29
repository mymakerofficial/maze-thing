import { writable } from 'svelte/store';
import {createCity} from "$lib/city";

export function createCityStore() {
    const city = createCity();

    const nodes = writable(city.getPathfindingNodes());

    const done = writable(false);

    let interval: number | undefined;

    function setValues() {
        nodes.set(city.getPathfindingNodes());
    }

    function step() {
        city.step();

        setValues();
    }

    function start() {
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
        done.set(false);
    }

    return {
        start,
        stop,
        step,
        reset,
        done,
        nodes,
    }
}