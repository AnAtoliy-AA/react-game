import React from 'react';
import { MAX_COLS, MAX_ROWS } from '../../constants';
import { useStore } from '../../hooks/hooks';

import { Cell, CellState, CellValue, Face } from '../../types';
import { checkMultipleVisibleCells, openMultipleEmptyCells, toggleStyleAllAdjacentCells } from '../../utils';
import './CellButton.scss';

interface ButtonProps {
    row: number;
    col: number;
    danger?: boolean;
    checked?: boolean;
    state: CellState;
    value: CellValue;
}

enum MouseButtons {
    LeftButton = 1,
    RightButton,
}

// eslint-disable-next-line react/prop-types
const CellButton: React.FC<ButtonProps> = ({ row, col, state, value, danger, checked }) => {
    const gameStore = useStore('gameStore');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        rowParam: number,
        colParam: number,
    ): void => {
        gameStore.setFaceButtonValue(Face.find);
        if (event.button === MouseButtons.RightButton) {
            if (!gameStore.isGameStarted) {
                return;
            } else toggleStyleAllAdjacentCells(gameStore.gameCells, rowParam, colParam, true);
        }
    };
    const handleMouseUp = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        rowParam: number,
        colParam: number,
    ): void => {
        gameStore.setFaceButtonValue(Face.smile);
        if (event.button === MouseButtons.RightButton) {
            if (!gameStore.isGameStarted) {
                return;
            } else toggleStyleAllAdjacentCells(gameStore.gameCells, rowParam, colParam, false);
        }
    };

    const handleCellClick = (rowParam: number, colParam: number): void => {
        if (!gameStore.isGameStarted) {
            let isFirstCellABomb = gameStore.gameCells[rowParam][colParam].value === CellValue.bomb;
            while (isFirstCellABomb) {
                gameStore.setStartCells();

                if (gameStore.gameCells[rowParam][colParam].value !== CellValue.bomb) {
                    isFirstCellABomb = false;
                    break;
                }
            }

            gameStore.setIsGameLost(false);
            gameStore.setIsGameStarted(true);
        }

        const currentCell = gameStore.gameCells[rowParam][colParam];
        let newCells = gameStore.gameCells.slice();

        if ([CellState.flagged, CellState.visible].includes(currentCell.state)) {
            return;
        }

        if (currentCell.value === CellValue.bomb) {
            gameStore.setIsGameLost(true);
            gameStore.setFaceButtonValue(Face.loose);
            gameStore.setIsGameStarted(false);
            newCells[rowParam][colParam].danger = true;
            newCells = showAllBombs();
            gameStore.setCells(newCells);
            return;
        } else if (currentCell.value === CellValue.empty) {
            newCells = openMultipleEmptyCells(newCells, rowParam, colParam);
            // gameStore.setCells(newCells);
        } else {
            newCells[rowParam][colParam].state = CellState.visible;
            // gameStore.setCells(newCells);
        }

        let safeOpenCellsExists = false;

        for (let row = 0; row < MAX_ROWS; row++) {
            for (let col = 0; col < MAX_COLS; col++) {
                const currentCell = newCells[row][col];

                if (currentCell.value !== CellValue.bomb && currentCell.state !== CellState.visible) {
                    safeOpenCellsExists = true;
                    break;
                }
            }
        }

        if (!safeOpenCellsExists) {
            newCells = newCells.map((row) =>
                // eslint-disable-next-line react/prop-types
                row.map((cell) => {
                    if (cell.value === CellValue.bomb) {
                        return {
                            ...cell,
                            state: CellState.flagged,
                        };
                    }
                    return cell;
                }),
            );
            gameStore.setIsGameWon(true);
        }

        gameStore.setCells(newCells);
    };

    const handleCellContext = (rowParam: number, colParam: number) => (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ): void => {
        e.preventDefault();

        if (!gameStore.isGameStarted) {
            return;
        }

        const currentCells = gameStore.gameCells.slice();
        const currentCell = gameStore.gameCells[rowParam][colParam];

        if (currentCell.state === CellState.visible) {
            checkMultipleVisibleCells(currentCells, rowParam, colParam);
            checkIfGameLost();
            return;
        } else if (currentCell.state === CellState.default) {
            currentCells[rowParam][colParam].state = CellState.flagged;
            gameStore.setCells(currentCells);
            gameStore.decrementBombCounter();
        } else if (currentCell.state === CellState.flagged) {
            currentCells[rowParam][colParam].state = CellState.default;
            gameStore.setCells(currentCells);
            gameStore.incrementBombCounter();
        }
    };

    const showAllBombs = (): Cell[][] => {
        const currentCells = gameStore.gameCells.slice();

        return currentCells.map((row) =>
            // eslint-disable-next-line react/prop-types
            row.map((cell) => {
                if (cell.value === CellValue.bomb) {
                    return {
                        ...cell,
                        state: CellState.visible,
                    };
                }
                return cell;
            }),
        );
    };

    const checkIfGameLost = (): void => {
        const currentCells = gameStore.gameCells.slice();

        currentCells.forEach((row) =>
            // eslint-disable-next-line react/prop-types
            row.forEach((cell) => {
                if (cell.value === CellValue.bomb && cell.state === CellState.visible) {
                    gameStore.setIsGameLost(true);
                }
            }),
        );
    };

    if (gameStore.isGameLost) {
        gameStore.setFaceButtonValue(Face.loose);
        gameStore.setIsGameStarted(false);
        console.log('LASHARA', gameStore.isGameLost);
    }

    const renderContent = (): React.ReactNode => {
        if (state === CellState.visible) {
            if (value === CellValue.bomb) {
                return (
                    <span role="img" aria-label="bomb">
                        💣
                    </span>
                );
            } else if (value === CellValue.empty) {
                return null;
            }

            return value;
        } else if (state === CellState.flagged) {
            return (
                <span role="img" aria-label="flag">
                    🚩
                </span>
            );
        }

        return null;
    };

    return (
        <div
            className={`Button ${state === CellState.visible && 'visible'} value-${value} ${danger ? 'danger' : ''} ${
                checked ? 'checked' : ''
            }`}
            onMouseDown={(event) => handleMouseDown(event, row, col)}
            onMouseUp={(event) => handleMouseUp(event, row, col)}
            onClick={() => handleCellClick(row, col)}
            onContextMenu={handleCellContext(row, col)}
        >
            {renderContent()}
        </div>
    );
};

export default CellButton;
