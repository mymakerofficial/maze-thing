import type {Vector} from "$lib/models/vector";

export interface GridCell extends Vector {
    wallTop: boolean;
    wallRight: boolean;
    wallBottom: boolean;
    wallLeft: boolean;
}

export function createGridCell(cell: Partial<GridCell>, walls: boolean = false): GridCell {
    return {
        x: 0,
        y: 0,
        wallTop: walls,
        wallRight: walls,
        wallBottom: walls,
        wallLeft: walls,
        ...cell,
    };
}

export type Grid = Array<Array<GridCell>>;

export function createGrid(width: number, height: number, walls: boolean = false): Grid {
    if (width < 1 || height < 1) throw new Error("Width and height must be greater than 0");

    const grid = new Array<Array<GridCell>>(width) as Grid;

    for (let x = 0; x < grid.length; x++) {
        grid[x] = new Array<GridCell>(height);

        for (let y = 0; y < grid[x].length; y++) {
            grid[x][y] = createGridCell({x, y}, walls);
        }
    }

    return grid;
}