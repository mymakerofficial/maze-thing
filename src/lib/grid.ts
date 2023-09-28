export interface Cell {
    x: number;
    y: number;
    wallTop: boolean;
    wallRight: boolean;
    wallBottom: boolean;
    wallLeft: boolean;
}

export type Grid = Array<Array<Cell>>;

export function createCell(x: number, y: number): Cell {
    return {
        x,
        y,
        wallTop: true,
        wallRight: true,
        wallBottom: true,
        wallLeft: true,
    };
}

export function createGrid(width: number, height: number): Grid {
    const grid = new Array<Array<Cell>>(width) as Grid;

    for (let x = 0; x < grid.length; x++) {
        grid[x] = new Array<Cell>(height);

        for (let y = 0; y < grid[x].length; y++) {
            grid[x][y] = createCell(x, y);
        }
    }

    return grid
}