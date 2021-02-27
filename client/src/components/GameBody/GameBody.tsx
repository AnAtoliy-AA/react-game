import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef } from 'react';
import { useStore } from '../../hooks/hooks';
import CellButton from '../CellButton/CellButton';
import './GameBody.scss';

import { Cell, CellState, CellValue, Face } from '../../types';
import { checkMultipleVisibleCells, openMultipleEmptyCells, toggleStyleAllAdjacentCells } from '../../utils';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import useSound from 'use-sound';
import lostSound from '../../assets/sounds/failure.mp3';
import winSound from '../../assets/sounds/success.mp3';
import checkSound from '../../assets/sounds/correct.mp3';
// import gameMusic from '../../assets/sounds/music.mp3';

import { toJS } from 'mobx';

enum MouseButtons {
    LeftButton = 1,
    RightButton,
}

const KEYBOARD_KEYS = {
    START_KEYBOARD_USE: 'NumpadDivide',
    STOP_KEYBOARD_USE: 'NumpadMultiply',
    RESTART_GAME: 'NumpadEnter',
    MOVE_UP: 'Numpad8',
    MOVE_DOWN: 'Numpad2',
    MOVE_LEFT: 'Numpad4',
    MOVE_RIGHT: 'Numpad6',
    LEFT_CLICK: 'Numpad5',
    RIGHT_CLICK: 'Numpad0',
};

const GameBody: React.FC = () => {
    const gameStore = useStore('gameStore');
    const gameSettingsStore = useStore('gameSettingsStore');
    const authStore = useStore('authStore');
    const [playLostSound] = useSound(lostSound, { volume: gameSettingsStore.gameSettings.gameSoundVolume });
    const [playWinSound] = useSound(winSound, { volume: gameSettingsStore.gameSettings.gameSoundVolume });
    const [playCheckSound] = useSound(checkSound, { volume: gameSettingsStore.gameSettings.gameSoundVolume });
    // const [playGameMusic] = useSound(gameMusic, { volume: gameSettingsStore.gameSettings.gameMusicVolume });

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
            // playGameMusic();
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
            sendStatistics();
            playLostSound();
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
        playCheckSound();
        saveGame(newCells);
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
            gameStore.setIsGameStarted(false);
            gameStore.setIsGameWon(true);
            sendStatistics();
            playWinSound();
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
                    // sendStatistics();
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

    const saveGame = (newCells: Cell[][]) => {
        const savedGame = newCells.map((row) => {
            return row.map((col) => {
                return toJS(col);
            });
        });
        const bombsCount = toJS(gameStore.bombCount);
        const gameTime = toJS(gameStore.gameTime);
        axios
            .patch(
                'api/gamesave',
                {
                    list: {
                        savedGame: savedGame,
                        bombsCount: bombsCount,
                        gameTime: gameTime,
                    },
                },
                {
                    headers: {
                        authorization: authStore.token,
                    },
                },
            )
            .then((response) => {
                // gameSettingsStore.setGameSettings(response.data.list[0]);
                // gameStore.setDefaultStartGameValues(
                //     gameSettingsStore.gameSettings.fieldHeight,
                //     gameSettingsStore.gameSettings.fieldWidth,
                //     gameSettingsStore.gameSettings.bombsQuantity,
                // );    // sendRequest();
            });
    };

    const useKey = (key: any, cb: any) => {
        const callbackRef = useRef(cb);

        useEffect(() => {
            callbackRef.current = cb;
        });

        useEffect(() => {
            const handle = (event: { code: any }) => {
                if (event.code === key) {
                    callbackRef.current(event);
                }
            };
            document.addEventListener('keypress', handle);
            return () => document.removeEventListener('keypress', handle);
        }, [key]);
    };

    const handleRestartGame = () => {
        gameStore.setDefaultStartGameValues(
            gameSettingsStore.gameSettings.fieldHeight,
            gameSettingsStore.gameSettings.fieldWidth,
            gameSettingsStore.gameSettings.bombsQuantity,
        );
    };

    const handleStartKeyboardUse = () => {
        const newCells = gameStore.gameCells.slice();
        newCells[gameStore.activeCellRow][gameStore.activeCellCol].active = true;
        gameStore.setCells(newCells);
    };

    const handleStopKeyboardUse = () => {
        const newCells = gameStore.gameCells.slice();
        newCells[gameStore.activeCellRow][gameStore.activeCellCol].active = false;
        gameStore.setCells(newCells);
    };

    const handleMoveUp = () => {
        if (gameStore.activeCellRow === 0) {
            return;
        } else {
            const newCells = gameStore.gameCells.slice();
            newCells[gameStore.activeCellRow][gameStore.activeCellCol].active = false;
            newCells[--gameStore.activeCellRow][gameStore.activeCellCol].active = true;
            gameStore.setCells(newCells);
        }
    };
    const handleMoveDown = () => {
        if (gameStore.activeCellRow === gameSettingsStore.gameSettings.fieldHeight - 1) {
            return;
        } else {
            const newCells = gameStore.gameCells.slice();
            newCells[gameStore.activeCellRow][gameStore.activeCellCol].active = false;
            newCells[++gameStore.activeCellRow][gameStore.activeCellCol].active = true;
            gameStore.setCells(newCells);
        }
    };

    const handleMoveLeft = () => {
        if (gameStore.activeCellCol === 0) {
            return;
        } else {
            const newCells = gameStore.gameCells.slice();
            newCells[gameStore.activeCellRow][gameStore.activeCellCol].active = false;
            newCells[gameStore.activeCellRow][--gameStore.activeCellCol].active = true;
            gameStore.setCells(newCells);
        }
    };
    const handleMoveRight = () => {
        if (gameStore.activeCellCol === gameSettingsStore.gameSettings.fieldWidth - 1) {
            return;
        } else {
            const newCells = gameStore.gameCells.slice();
            newCells[gameStore.activeCellRow][gameStore.activeCellCol].active = false;
            newCells[gameStore.activeCellRow][++gameStore.activeCellCol].active = true;
            gameStore.setCells(newCells);
        }
    };

    const handleLeftClick = () => {
        handleCellClick(gameStore.activeCellRow, gameStore.activeCellCol);
    };

    //TODO
    const handleRightClick = () => {
        // handleRightMouseButton(gameStore.activeCellRow, gameStore.activeCellCol, true);
        // handleCellContext(gameStore.activeCellRow, gameStore.activeCellCol);
        if (!gameStore.isGameStarted || gameStore.isGameLost || gameStore.isGameWon) {
            return;
        }

        const currentCells = gameStore.gameCells.slice();
        const currentCell = gameStore.gameCells[gameStore.activeCellRow][gameStore.activeCellCol];

        if (currentCell.state === CellState.visible) {
            checkMultipleVisibleCells(
                currentCells,
                gameStore.activeCellRow,
                gameStore.activeCellCol,
                gameSettingsStore.gameSettings.fieldHeight,
                gameSettingsStore.gameSettings.fieldWidth,
            );
            checkIfGameLost();
            return;
        } else if (currentCell.state === CellState.default) {
            currentCells[gameStore.activeCellRow][gameStore.activeCellCol].state = CellState.flagged;
            gameStore.setCells(currentCells);
            gameStore.decrementBombCounter();
        } else if (currentCell.state === CellState.flagged) {
            currentCells[gameStore.activeCellRow][gameStore.activeCellCol].state = CellState.default;
            gameStore.setCells(currentCells);
            gameStore.incrementBombCounter();
        }
        gameStore.incrementGameMoves();
        checkIfGameIsWon(gameStore.gameCells);
    };

    useKey(KEYBOARD_KEYS.RESTART_GAME, handleRestartGame);
    useKey(KEYBOARD_KEYS.START_KEYBOARD_USE, handleStartKeyboardUse);

    useKey(KEYBOARD_KEYS.STOP_KEYBOARD_USE, handleStopKeyboardUse);
    useKey(KEYBOARD_KEYS.MOVE_UP, handleMoveUp);
    useKey(KEYBOARD_KEYS.MOVE_DOWN, handleMoveDown);
    useKey(KEYBOARD_KEYS.MOVE_LEFT, handleMoveLeft);
    useKey(KEYBOARD_KEYS.MOVE_RIGHT, handleMoveRight);
    useKey(KEYBOARD_KEYS.LEFT_CLICK, handleLeftClick);
    useKey(KEYBOARD_KEYS.RIGHT_CLICK, handleRightClick);

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
                            active={cell.active}
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
        </Grid>
    );
};

export default observer(GameBody);
