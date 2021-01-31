import { Cell, CellState, CellValue } from './../types';
import { MAX_COLS, MAX_ROWS, N_OF_BOMBS } from './../constants';

export const generateCells = (): Cell[][] => {
    const cells: Cell[][] = [];

    for (let row = 0; row < MAX_ROWS; row++) {
        cells.push([]);
        for (let col = 0; col < MAX_COLS; col++) {
            cells[row].push({
                value: CellValue.empty,
                state: CellState.visible,
            });
        }
    }

    let bombsPlaced = 0;
    while (bombsPlaced < N_OF_BOMBS) {
        const randomRow = Math.floor(Math.random() * MAX_ROWS);
        const randomCol = Math.floor(Math.random() * MAX_COLS);
        const currentCell = cells[randomRow][randomCol];

        if (currentCell.value !== CellValue.bomb) {
            cells[randomRow][randomCol] = {
                ...cells[randomRow][randomCol],
                value: CellValue.bomb,
            };
            bombsPlaced++;
        }
    }

    return cells;
};
