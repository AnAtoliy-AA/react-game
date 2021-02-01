import { Cell, CellState, CellValue } from './../types';
import { MAX_COLS, MAX_ROWS, N_OF_BOMBS } from './../constants';

const grabAllAdjacentCells = (
    cells: Cell[][],
    rowIndex: number,
    colIndex: number,
): {
    topLeftCell: Cell | null;
    topCell: Cell | null;
    topRightCell: Cell | null;
    leftCell: Cell | null;
    rightCell: Cell | null;
    bottomLeftCell: Cell | null;
    bottomCell: Cell | null;
    bottomRightCell: Cell | null;
} => {
    const topLeftCell = rowIndex > 0 && colIndex > 0 ? cells[rowIndex - 1][colIndex - 1] : null;
    const topCell = rowIndex > 0 ? cells[rowIndex - 1][colIndex] : null;
    const topRightCell = rowIndex > 0 && colIndex < MAX_COLS - 1 ? cells[rowIndex - 1][colIndex + 1] : null;
    const leftCell = colIndex > 0 ? cells[rowIndex][colIndex - 1] : null;
    const rightCell = colIndex < MAX_COLS - 1 ? cells[rowIndex][colIndex + 1] : null;
    const bottomLeftCell = rowIndex < MAX_ROWS - 1 && colIndex > 0 ? cells[rowIndex + 1][colIndex - 1] : null;
    const bottomCell = rowIndex < MAX_ROWS - 1 ? cells[rowIndex + 1][colIndex] : null;
    const bottomRightCell =
        rowIndex < MAX_ROWS - 1 && colIndex < MAX_COLS - 1 ? cells[rowIndex + 1][colIndex + 1] : null;

    return {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell,
    };
};

export const generateCells = (): Cell[][] => {
    const cells: Cell[][] = [];

    for (let row = 0; row < MAX_ROWS; row++) {
        cells.push([]);
        for (let col = 0; col < MAX_COLS; col++) {
            cells[row].push({
                value: CellValue.empty,
                state: CellState.default,
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
                state: currentCell.state,
                value: CellValue.bomb,
            };
            bombsPlaced++;
        }
    }

    for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
        for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
            const currentCell = cells[rowIndex][colIndex];
            if (currentCell.value === CellValue.bomb) {
                continue;
            }

            let numberOfBombs = 0;
            const {
                topLeftCell,
                topCell,
                topRightCell,
                leftCell,
                rightCell,
                bottomLeftCell,
                bottomCell,
                bottomRightCell,
            } = grabAllAdjacentCells(cells, rowIndex, colIndex);
            if (topLeftCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (topCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (topRightCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (leftCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (rightCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (bottomLeftCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (bottomCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (bottomRightCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }

            if (numberOfBombs > 0) {
                cells[rowIndex][colIndex] = {
                    ...currentCell,
                    value: numberOfBombs,
                };
            }
        }
    }

    return cells;
};

export const openMultipleEmptyCells = (cells: Cell[][], rowParam: number, colParam: number): Cell[][] => {
    let newCells = cells.slice();

    newCells[rowParam][colParam].state = CellState.visible;

    const {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell,
    } = grabAllAdjacentCells(cells, rowParam, colParam);

    if (topLeftCell?.state === CellState.default && topLeftCell?.value !== CellValue.bomb) {
        if (topLeftCell?.value === CellValue.empty) {
            newCells = openMultipleEmptyCells(newCells, rowParam - 1, colParam - 1);
        } else {
            newCells[rowParam - 1][colParam - 1].state = CellState.visible;
        }
    }

    if (topCell?.state === CellState.default && topCell?.value !== CellValue.bomb) {
        if (topCell?.value === CellValue.empty) {
            newCells = openMultipleEmptyCells(newCells, rowParam - 1, colParam);
        } else {
            newCells[rowParam - 1][colParam].state = CellState.visible;
        }
    }

    if (topRightCell?.state === CellState.default && topRightCell?.value !== CellValue.bomb) {
        if (topRightCell?.value === CellValue.empty) {
            newCells = openMultipleEmptyCells(newCells, rowParam - 1, colParam + 1);
        } else {
            newCells[rowParam - 1][colParam + 1].state = CellState.visible;
        }
    }

    if (leftCell?.state === CellState.default && leftCell?.value !== CellValue.bomb) {
        if (leftCell?.value === CellValue.empty) {
            newCells = openMultipleEmptyCells(newCells, rowParam, colParam - 1);
        } else {
            newCells[rowParam][colParam - 1].state = CellState.visible;
        }
    }

    if (rightCell?.state === CellState.default && rightCell?.value !== CellValue.bomb) {
        if (rightCell?.value === CellValue.empty) {
            newCells = openMultipleEmptyCells(newCells, rowParam, colParam + 1);
        } else {
            newCells[rowParam][colParam + 1].state = CellState.visible;
        }
    }

    if (bottomLeftCell?.state === CellState.default && bottomLeftCell?.value !== CellValue.bomb) {
        if (bottomLeftCell?.value === CellValue.empty) {
            newCells = openMultipleEmptyCells(newCells, rowParam + 1, colParam - 1);
        } else {
            newCells[rowParam + 1][colParam - 1].state = CellState.visible;
        }
    }

    if (bottomCell?.state === CellState.default && bottomCell?.value !== CellValue.bomb) {
        if (bottomCell?.value === CellValue.empty) {
            newCells = openMultipleEmptyCells(newCells, rowParam + 1, colParam);
        } else {
            newCells[rowParam + 1][colParam].state = CellState.visible;
        }
    }

    if (bottomRightCell?.state === CellState.default && bottomRightCell?.value !== CellValue.bomb) {
        if (bottomRightCell?.value === CellValue.empty) {
            newCells = openMultipleEmptyCells(newCells, rowParam + 1, colParam + 1);
        } else {
            newCells[rowParam + 1][colParam + 1].state = CellState.visible;
        }
    }

    return newCells;
};
