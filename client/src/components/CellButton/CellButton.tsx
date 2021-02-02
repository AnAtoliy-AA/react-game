import React from 'react';
import { MAX_COLS, MAX_ROWS } from '../../constants';
import { useStore } from '../../hooks/hooks';

import { Cell, CellState, CellValue, Face } from '../../types';
import { openMultipleEmptyCells } from '../../utils';
import './CellButton.scss';

interface ButtonProps {
    row: number;
    col: number;
    danger?: boolean;
    state: CellState;
    value: CellValue;
}

// eslint-disable-next-line react/prop-types
const CellButton: React.FC<ButtonProps> = ({ row, col, state, value, danger }) => {
    const gameStore = useStore('gameStore');
    const handleMouseDown = (): void => {
        gameStore.setFaceButtonValue(Face.find);
    };
    const handleMouseUp = (): void => {
        gameStore.setFaceButtonValue(Face.smile);
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
            className={`Button ${state === CellState.visible && 'visible'} value-${value} ${danger ? 'danger' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={() => handleCellClick(row, col)}
            onContextMenu={handleCellContext(row, col)}
        >
            {renderContent()}
        </div>
    );
};

export default CellButton;
