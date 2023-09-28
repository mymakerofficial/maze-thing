<script lang="ts">
    import type { Node } from "$lib/astar";

    export let nodes: Set<Node> = new Set();

    export let getRed: (node: Node) => boolean = () => false;
    export let getGreen: (node: Node) => boolean = () => false;
    export let getBlue: (node: Node) => boolean = () => false;

    const scale = 40;

    const padding = 0.2;

    const nodeSize = 0.15;

    const arrowSize = 0.2;
    const arrowWingAngle = 30;

    $: width = Math.max(...Array.from(nodes).map(node => node.x));
    $: height = Math.max(...Array.from(nodes).map(node => node.y));

    function getLine(aX: number, aY: number, bX: number, bY: number) {
        const angle = Math.atan2(bY - aY, bX - aX); // radians

        // start and end points with distance of nodeSize from the center of the node
        const startX = aX + Math.cos(angle) * nodeSize;
        const startY = aY + Math.sin(angle) * nodeSize;

        const endX = bX - Math.cos(angle) * nodeSize;
        const endY = bY - Math.sin(angle) * nodeSize;

        return {
            startX,
            startY,
            endX,
            endY
        };
    }

    // generates points for an arrow (unscaled)
    function getArrow(aX: number, aY: number, bX: number, bY: number) {
        const angle = Math.atan2(bY - aY, bX - aX); // radians

        const wingAngle = arrowWingAngle * Math.PI / 180; // radians

        // peak of arrow
        // should be on the line between the two points with a distance of nodeSize from the second point
        const peakX = bX - Math.cos(angle) * nodeSize;
        const peakY = bY - Math.sin(angle) * nodeSize;

        // left and right points of arrow with length arrowSize
        const leftX = peakX - Math.cos(angle - wingAngle) * arrowSize;
        const leftY = peakY - Math.sin(angle - wingAngle) * arrowSize;
        const rightX = peakX - Math.cos(angle + wingAngle) * arrowSize;
        const rightY = peakY - Math.sin(angle + wingAngle) * arrowSize;

        return {
            peakX,
            peakY,
            leftX,
            leftY,
            rightX,
            rightY
        };
    }

    // applies scaling and padding to a number
    function scl(n: number) {
        return (n + padding) * scale;
    }

    function getColor(node: Node) {
        if (getBlue(node)) {
            return "blue";
        } else if (getRed(node)) {
            return "red";
        } else if (getGreen(node)) {
            return "green";
        } else {
            return "black";
        }
    }
</script>

<svg viewBox={`0 0 ${(width + padding * 2) * scale} ${(height + padding * 2) * scale}`} class="h-96">
    <g>
        {#each nodes as node}
            <circle
                data-color={getColor(node)}
                cx={scl(node.x)}
                cy={scl(node.y)}
                r={nodeSize * scale}
                class="fill-neutral-400 data-[color=red]:fill-rose-400 data-[color=green]:fill-green-400 data-[color=blue]:fill-blue-400 data-[color=yellow]:fill-amber-300 data-[color=purple]:fill-purple-400"
            />
        {/each}
    </g>
    <g>
        {#each nodes as node}
            {#each node.neighbors as neighbor}
                {@const { startX, startY, endX, endY } = getLine(node.x, node.y, neighbor.x, neighbor.y) }
                {@const { peakX, peakY, leftX, leftY, rightX, rightY } = getArrow(node.x, node.y, neighbor.x, neighbor.y) }
                <g>
                    <line x1={scl(startX)} y1={scl(startY)} x2={scl(endX)} y2={scl(endY)} class="stroke-neutral-600" />
                    <polygon points={`${scl(peakX)},${scl(peakY)} ${scl(leftX)},${scl(leftY)} ${scl(rightX)},${scl(rightY)}`} class="fill-neutral-600" />
                </g>
            {/each}
        {/each}
    </g>
</svg>