import {getCellByPosition, getNeighbors, randomCellIn, removeWallsBetween, replaceGrid} from "$lib/utils/grid-utils";
import {createGrid} from "$lib/models/grid";
import type {Grid, GridCell} from "$lib/models/grid";
import {NULL_VECTOR} from "$lib/utils/vector-utils";
import { chooseRandom } from "$lib/utils/math-utils";

// https://en.wikipedia.org/wiki/Maze_generation_algorithm?useskin=vector#Randomized_depth-first_search
export function createRecursiveBacktrackerMaze() {
    const grid = createGrid(1, 1, true);

    const stack = new Array<GridCell>();

    const visitedSet = new Set<GridCell>();

    let currentCell = getCellByPosition(grid, NULL_VECTOR);

    function getUnvisitedNeighbors(grid: Grid, cell: GridCell): Set<GridCell> {
        const neighbors = getNeighbors(grid, cell);

        const unvisitedNeighbors = new Set<GridCell>();

        for (const neighbor of neighbors) {
            if (!visitedSet.has(neighbor)) {
                unvisitedNeighbors.add(neighbor);
            }
        }

        return unvisitedNeighbors;
    }

    /***
     @returns true if the maze is complete
     @returns false if the maze is not complete
    */
    function step(): boolean {
        if (stack.length === 0) {
            return true;
        }

        currentCell = stack.pop()!;

        const notVisitedNeighbors = getUnvisitedNeighbors(grid, currentCell);

        if (notVisitedNeighbors.size > 0) {
            stack.push(currentCell);

            const selectedCell = chooseRandom(notVisitedNeighbors);

            removeWallsBetween(currentCell, selectedCell);

            visitedSet.add(selectedCell);
            stack.push(selectedCell);
        }

        return false;
    }

    function init(width: number, height: number) {
        const newGrid = createGrid(width, height, true);
        replaceGrid(grid, newGrid);

        stack.length = 0;
        visitedSet.clear();

        currentCell = randomCellIn(grid);

        visitedSet.add(currentCell);
        stack.push(currentCell);
    }

    return {
        step,
        init,
        grid,
        stack,
        visitedSet,
        currentCell
    }
}