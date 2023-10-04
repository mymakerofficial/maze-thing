import {get, writable} from 'svelte/store';
import {createCity} from "$lib/algorithms/city";

export function createCityStore() {
    const city = createCity();

    const nodes = writable(city.nodes);

    const activeNodes = writable(city.activeNodes);

    const steps = writable(0);
    const done = writable(false);

    let interval: number | undefined;

    function setValues() {
        nodes.set(city.nodes);
        activeNodes.set(city.activeNodes);
    }

    function step() {
        if (get(done)) {
            stop();
            return;
        }

        const res = city.step();

        steps.update(n => n + 1);
        setValues();

        if (res) {
            done.set(true);
        }
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
        done.set(false);
        steps.set(0);
    }

    return {
        start,
        stop,
        step,
        reset,
        steps,
        done,
        nodes,
        activeNodes,
    }
}