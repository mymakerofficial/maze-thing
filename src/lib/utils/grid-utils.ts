import type {Grid, GridCell} from "$lib/models/grid";
import type {Vector} from "$lib/models/vector";

export function getByPosition(grid: Grid, position: Vector): GridCell | undefined {
    return grid[position.x]?.[position.y];
}

export function positionFromCell(cell: GridCell): Vector {
    return {x: cell.x, y: cell.y};
}