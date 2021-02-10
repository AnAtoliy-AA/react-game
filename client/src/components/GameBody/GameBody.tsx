import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../hooks/hooks';
import CellButton from '../CellButton/CellButton';
import './GameBody.scss';

import { Cell, CellState, CellValue, Face } from '../../types';
import { checkMultipleVisibleCells, openMultipleEmptyCells, toggleStyleAllAdjacentCells } from '../../utils';
import { Grid } from '@material-ui/core';
import axios from 'axios';

enum MouseButtons {
    LeftButton = 1,
    RightButton,
}

const GameBody: React.FC = () => {
    const gameStore = useStore('gameStore');
    const gameSettingsStore = useStore('gameSettingsStore');
    const authStore = useStore('authStore');
    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        rowParam: number,
        colParam: number,
    ): void => {
        gameStore.setFaceButtonValue(Face.find);
        if (event.button === MouseButtons.RightButton) {
            handleRightMouseButton(rowParam, colParam, true);
        }
    };
    const handleMouseUp = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        rowParam: number,
        colParam: number,
    ): void => {
        gameStore.setFaceButtonValue(Face.smile);
        if (event.button === MouseButtons.RightButton) {
            handleRightMouseButton(rowParam, colParam, false);
        }
    };

    const handleRightMouseButton = (rowParam: number, colParam: number, value: boolean) => {
        if (!gameStore.isGameStarted) {
            return;
        } else
            toggleStyleAllAdjacentCells(
                gameStore.gameCells,
                rowParam,
                colParam,
                value,
                gameSettingsStore.gameSettings.fieldHeight,
                gameSettingsStore.gameSettings.fieldWidth,
            );
        checkIfGameIsWon(gameStore.gameCells);
    };

    const handleCellClick = (rowParam: number, colParam: number): void => {
        if (!gameStore.isGameStarted && !gameStore.isGameLost && !gameStore.isGameWon) {
            let isFirstCellABomb = gameStore.gameCells[rowParam][colParam].value === CellValue.bomb;
            while (isFirstCellABomb) {
                gameStore.setStartCells(
                    gameSettingsStore.gameSettings.fieldHeight,
                    gameSettingsStore.gameSettings.fieldWidth,
                    gameSettingsStore.gameSettings.bombsQuantity,
                );

                if (gameStore.gameCells[rowParam][colParam].value !== CellValue.bomb) {
                    isFirstCellABomb = false;
                    break;
                }
            }

            gameStore.setGameStartedValues();
        }

        //TODO NEED IT??
        if (gameStore.isGameLost || gameStore.isGameWon) {
            return;
        }

        const currentCell = gameStore.gameCells[rowParam][colParam];
        let newCells = gameStore.gameCells.slice();

        if ([CellState.flagged, CellState.visible].includes(currentCell.state)) {
            return;
        }

        if (currentCell.value === CellValue.bomb) {
            gameStore.setGameLostValues();
            newCells[rowParam][colParam].danger = true;
            newCells = showAllBombs();
            gameStore.setCells(newCells);
            return;
        } else if (currentCell.value === CellValue.empty) {
            newCells = openMultipleEmptyCells(
                newCells,
                rowParam,
                colParam,
                gameSettingsStore.gameSettings.fieldHeight,
                gameSettingsStore.gameSettings.fieldWidth,
            );
            gameStore.setCells(newCells);
        } else {
            newCells[rowParam][colParam].state = CellState.visible;
            gameStore.setCells(newCells);
        }
        gameStore.incrementGameMoves();
        checkIfGameIsWon(newCells);

        // gameStore.setCells(newCells);
    };

    const checkIfGameIsWon = (cells: Cell[][]) => {
        let safeOpenCellsExists = false;

        for (let row = 0; row < gameSettingsStore.gameSettings.fieldHeight; row++) {
            for (let col = 0; col < gameSettingsStore.gameSettings.fieldWidth; col++) {
                const currentCell = cells[row][col];

                if (currentCell.value !== CellValue.bomb && currentCell.state !== CellState.visible) {
                    safeOpenCellsExists = true;
                    break;
                }
            }
        }

        if (!safeOpenCellsExists) {
            cells = cells.map((row: Cell[]) =>
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
        gameStore.setCells(cells);
    };

    const handleCellContext = (rowParam: number, colParam: number) => (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ): void => {
        e.preventDefault();

        if (!gameStore.isGameStarted || gameStore.isGameLost || gameStore.isGameWon) {
            return;
        }

        const currentCells = gameStore.gameCells.slice();
        const currentCell = gameStore.gameCells[rowParam][colParam];

        if (currentCell.state === CellState.visible) {
            checkMultipleVisibleCells(
                currentCells,
                rowParam,
                colParam,
                gameSettingsStore.gameSettings.fieldHeight,
                gameSettingsStore.gameSettings.fieldWidth,
            );
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
        gameStore.incrementGameMoves();
        checkIfGameIsWon(gameStore.gameCells);
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
                    gameStore.setGameLostValues();
                }
            }),
        );
    };

    const sendStatistics = () => {
        axios.post(
            'api/statistics',
            {
                list: {
                    level: gameSettingsStore.gameSettings.fieldSize,
                    statusWin: gameStore.isGameWon,
                    statusLost: gameStore.isGameLost,
                    gameMoves: gameStore.gameMoves,
                    time: gameStore.gameTime,
                },
            },
            {
                headers: {
                    authorization: authStore.token,
                },
            },
        );
    };
    const renderCells = (): React.ReactNode => {
        return gameStore.gameCells.map((row, rowIndex) => (
            <Grid container key={`${rowIndex}`} justify="center">
                {row.map((cell, colIndex) => (
                    <Grid
                        item
                        key={`${rowIndex}${colIndex}`}
                        onMouseDown={(event) => handleMouseDown(event, rowIndex, colIndex)}
                        onMouseUp={(event) => handleMouseUp(event, rowIndex, colIndex)}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        onContextMenu={handleCellContext(rowIndex, colIndex)}
                    >
                        <CellButton
                            state={cell.state}
                            value={cell.value}
                            danger={cell.danger}
                            checked={cell.checked}
                            row={rowIndex}
                            col={colIndex}
                        />
                    </Grid>
                ))}
            </Grid>
        ));
    };

    return (
        <Grid className="GameBody" justify="center">
            {renderCells()}
            <button onClick={sendStatistics}>st</button>
        </Grid>
    );
};

export default observer(GameBody);
