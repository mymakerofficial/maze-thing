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

function setWall(grid: Grid, x: number, y: number, value: boolean, direction: "top" | "right" | "bottom" | "left") {
    switch (direction) {
        case "top":
            if (y === 0) return;
            grid[x][y].wallTop = value;
            grid[x][y - 1].wallBottom = value;
            break;
        case "right":
            if (x === grid.length - 1) return;
            grid[x][y].wallRight = value;
            grid[x + 1][y].wallLeft = value;
            break;
        case "bottom":
            if (y === grid[x].length - 1) return;
            grid[x][y].wallBottom = value;
            grid[x][y + 1].wallTop = value;
            break;
        case "left":
            if (x === 0) return;
            grid[x][y].wallLeft = value;
            grid[x - 1][y].wallRight = value;
            break;
    }
}

export function createGrid(width: number, height: number): Grid {
    const grid = new Array<Array<Cell>>(width) as Grid;

    for (let x = 0; x < grid.length; x++) {
        grid[x] = new Array<Cell>(height);

        for (let y = 0; y < grid[x].length; y++) {
            grid[x][y] = createCell(x, y);
        }
    }

    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            setWall(grid, x, y, Math.random() < 0.3, "top");
            setWall(grid, x, y, Math.random() < 0.3, "right");
            setWall(grid, x, y, Math.random() < 0.3, "bottom");
            setWall(grid, x, y, Math.random() < 0.3, "left");
        }
    }

    return grid
}