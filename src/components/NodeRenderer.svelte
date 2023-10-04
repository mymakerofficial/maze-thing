<script lang="ts">
    import type {ConnectedNode} from "$lib/models/node.js";

    export let nodes: Set<ConnectedNode> = new Set();

    export let getRed: (node: ConnectedNode) => boolean = () => false;
    export let getGreen: (node: ConnectedNode) => boolean = () => false;
    export let getBlue: (node: ConnectedNode) => boolean = () => false;
    export let getYellow: (node: ConnectedNode) => boolean = () => false;
    export let getPurple: (node: ConnectedNode) => boolean = () => false;

    export let getArrowBlue: (nodeA: ConnectedNode, nodeB: ConnectedNode) => boolean = () => false;
    export let getArrowRed: (nodeA: ConnectedNode, nodeB: ConnectedNode) => boolean = () => false;
    export let getArrowGreen: (nodeA: ConnectedNode, nodeB: ConnectedNode) => boolean = () => false;

    let scale = 40;

    let padding = 0.2;

    let nodeSize = 0.15;

    let arrowSize = 0.2;
    let arrowWingAngle = 30;

    $: maxX = Math.max(...Array.from(nodes).map(node => node.x));
    $: maxY = Math.max(...Array.from(nodes).map(node => node.y));
    $: minX = Math.min(...Array.from(nodes).map(node => node.x));
    $: minY = Math.min(...Array.from(nodes).map(node => node.y));

    $: width = maxX - minX;
    $: height = maxY - minY;

    // offset for the center of the node
    $: offsetX = -minX;
    $: offsetY = -minY;

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
    function sclX(n: number) {
        return (n + padding + offsetX) * scale;
    }
    function sclY(n: number) {
        return (n + padding + offsetY) * scale;
    }

    function getColor(node: ConnectedNode) {
        if (getBlue(node)) {
            return "blue";
        } else if (getGreen(node)) {
            return "green";
        } else if (getRed(node)) {
            return "red";
        } else if (getYellow(node)) {
            return "yellow";
        } else if (getPurple(node)) {
            return "purple";
        } else {
            return "black";
        }
    }

    function getArrowColor(nodeA: ConnectedNode, nodeB: ConnectedNode) {
        if (getArrowBlue(nodeA, nodeB)) {
            return "blue";
        } if (getArrowRed(nodeA, nodeB)) {
            return "red";
        } if (getArrowGreen(nodeA, nodeB)) {
            return "green";
        } else {
            return "black";
        }
    }
</script>

<svg viewBox={`0 0 ${(width + padding * 2) * scale} ${(height + padding * 2) * scale}`} class="w-[600px]">
    <g>
        {#each nodes as node}
            <circle
                data-color={getColor(node)}
                cx={sclX(node.x)}
                cy={sclY(node.y)}
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
                    <line data-color={getArrowColor(node, neighbor)} x1={sclX(startX)} y1={sclY(startY)} x2={sclX(endX)} y2={sclY(endY)} stroke-width="2" class="stroke-neutral-600 data-[color=red]:stroke-rose-400 data-[color=green]:stroke-green-400 data-[color=blue]:stroke-blue-400" />
                    <polygon data-color={getArrowColor(node, neighbor)} points={`${sclX(peakX)},${sclY(peakY)} ${sclX(leftX)},${sclY(leftY)} ${sclX(rightX)},${sclY(rightY)}`} class="fill-neutral-600 data-[color=red]:fill-rose-400 data-[color=green]:fill-green-400 data-[color=blue]:fill-blue-400" />
                </g>
            {/each}
        {/each}
    </g>
</svg>