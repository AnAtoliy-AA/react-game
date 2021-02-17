import React from 'react';
import './AutoPlayScreen.scss';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import AutoPlayGameHeader from './AutoPlayGameHeader/AutoPlayGameHeader';
import AutoPlayGameBody from './AutoPlayGameBody/AutoPlayGameBody';
import { useStore } from '../../hooks/hooks';
import useSound from 'use-sound';
import lostSound from '../../assets/sounds/failure.mp3';
import winSound from '../../assets/sounds/success.mp3';
import { Cell, CellState, CellValue } from '../../types';
import {
    checkMultipleVisibleCells,
    grabAllAdjacentCells,
    openMultipleEmptyCells,
    toggleStyleAllAdjacentCells,
} from '../../utils';
import { Button } from '@material-ui/core';
import FullscreenIcon from '@material-ui/icons/Fullscreen';

const AUTO_PLAY_PARAMS = {
    FIELD_WIDTH: 9,
    FIELD_HEIGHT: 9,
    BOMBS_COUNT: 10,
};

const AutoPlayScreen: React.FC = () => {
    const handle = useFullScreenHandle();
    const gameStore = useStore('gameStore');
    const gameSettingsStore = useStore('gameSettingsStore');
    const authStore = useStore('authStore');
    const [playLostSound] = useSound(lostSound, { volume: gameSettingsStore.gameSettings.gameSoundVolume });
    const [playWinSound] = useSound(winSound, { volume: gameSettingsStore.gameSettings.gameSoundVolume });
    const handleAutoplay = () => {
        console.log('auto');
        gameStore.setDefaultStartGameValues(
            AUTO_PLAY_PARAMS.FIELD_HEIGHT,
            AUTO_PLAY_PARAMS.FIELD_WIDTH,
            AUTO_PLAY_PARAMS.BOMBS_COUNT,
        );
        handleAutoCellClick(5, 5);

        // const currentCells = gameStore.gameCells.slice();
        let iterationIndex = 0;
        const timer = setInterval(() => {
            const currentCells = gameStore.gameCells.slice();
            currentCells.forEach((row, rowIndex) => {
                row.forEach((col, colIndex) => {
                    if (
                        // currentCells[rowIndex][colIndex].value === 1 &&
                        currentCells[rowIndex][colIndex].state === CellState.visible
                    ) {
                        checkAutoMultipleDefaultCells(
                            currentCells,
                            rowIndex,
                            colIndex,
                            AUTO_PLAY_PARAMS.FIELD_HEIGHT,
                            AUTO_PLAY_PARAMS.FIELD_WIDTH,
                        );
                        checkMultipleVisibleCells(
                            currentCells,
                            rowIndex,
                            colIndex,
                            AUTO_PLAY_PARAMS.FIELD_HEIGHT,
                            AUTO_PLAY_PARAMS.FIELD_WIDTH,
                        );
                        gameStore.setCells(currentCells);
                        checkIfGameIsWon(currentCells);
                    }
                });
            });
            if (gameStore.isGameWon || gameStore.bombCount === 0) {
                currentCells.map((row, rowIndex) => {
                    row.map((col, colIndex) => {
                        if (
                            // currentCells[rowIndex][colIndex].value === 1 &&
                            currentCells[rowIndex][colIndex].state === CellState.default
                        ) {
                            currentCells[rowIndex][colIndex].state = CellState.visible;
                        }
                    });
                });
                gameStore.setCells(currentCells);
                clearInterval(timer);
            }
            iterationIndex++;
        }, 1000);
        // while (!gameStore.isGameWon || gameStore.bombCount !== 0) {
        //     const currentCells = gameStore.gameCells.slice();
        //     currentCells.forEach((row, rowIndex) => {
        //         row.forEach((col, colIndex) => {
        //             if (
        //                 // currentCells[rowIndex][colIndex].value === 1 &&
        //                 currentCells[rowIndex][colIndex].state === CellState.visible
        //             ) {
        //                 checkAutoMultipleDefaultCells(
        //                     currentCells,
        //                     rowIndex,
        //                     colIndex,
        //                     AUTO_PLAY_PARAMS.FIELD_HEIGHT,
        //                     AUTO_PLAY_PARAMS.FIELD_WIDTH,
        //                 );
        //                 checkMultipleVisibleCells(
        //                     currentCells,
        //                     rowIndex,
        //                     colIndex,
        //                     AUTO_PLAY_PARAMS.FIELD_HEIGHT,
        //                     AUTO_PLAY_PARAMS.FIELD_WIDTH,
        //                 );
        //                 gameStore.setCells(currentCells);
        //                 checkIfGameIsWon(currentCells);
        //             }
        //         });
        //     });
    };

    const checkAutoMultipleDefaultCells = (
        cells: Cell[][],
        rowParam: number,
        colParam: number,
        fieldHeight: number,
        fieldWidth: number,
    ): Cell[][] => {
        const currentCell = cells[rowParam][colParam];
        const newCells = cells.slice();

        const {
            topLeftCell,
            topCell,
            topRightCell,
            leftCell,
            rightCell,
            bottomLeftCell,
            bottomCell,
            bottomRightCell,
        } = grabAllAdjacentCells(cells, rowParam, colParam, fieldHeight, fieldWidth);

        let numberOfDefault = 0;

        if (topLeftCell?.state === CellState.default || topLeftCell?.state === CellState.flagged) {
            numberOfDefault++;
        }
        if (topCell?.state === CellState.default || topCell?.state === CellState.flagged) {
            numberOfDefault++;
        }
        if (topRightCell?.state === CellState.default || topRightCell?.state === CellState.flagged) {
            numberOfDefault++;
        }
        if (leftCell?.state === CellState.default || leftCell?.state === CellState.flagged) {
            numberOfDefault++;
        }
        if (rightCell?.state === CellState.default || rightCell?.state === CellState.flagged) {
            numberOfDefault++;
        }
        if (bottomLeftCell?.state === CellState.default || bottomLeftCell?.state === CellState.flagged) {
            numberOfDefault++;
        }
        if (bottomCell?.state === CellState.default || bottomCell?.state === CellState.flagged) {
            numberOfDefault++;
        }
        if (bottomRightCell?.state === CellState.default || bottomRightCell?.state === CellState.flagged) {
            numberOfDefault++;
        }

        if (numberOfDefault === currentCell.value) {
            if (topLeftCell?.state === CellState.default) {
                newCells[rowParam - 1][colParam - 1].state = CellState.flagged;
                gameStore.decrementBombCounter();
            }
            if (topCell?.state === CellState.default) {
                newCells[rowParam - 1][colParam].state = CellState.flagged;
                gameStore.decrementBombCounter();
            }
            if (topRightCell?.state === CellState.default) {
                newCells[rowParam - 1][colParam + 1].state = CellState.flagged;
                gameStore.decrementBombCounter();
            }
            if (leftCell?.state === CellState.default) {
                newCells[rowParam][colParam - 1].state = CellState.flagged;
                gameStore.decrementBombCounter();
            }
            if (rightCell?.state === CellState.default) {
                newCells[rowParam][colParam + 1].state = CellState.flagged;
                gameStore.decrementBombCounter();
            }
            if (bottomLeftCell?.state === CellState.default) {
                newCells[rowParam + 1][colParam - 1].state = CellState.flagged;
                gameStore.decrementBombCounter();
            }
            if (bottomCell?.state === CellState.default) {
                newCells[rowParam + 1][colParam].state = CellState.flagged;
                gameStore.decrementBombCounter();
            }
            if (bottomRightCell?.state === CellState.default) {
                newCells[rowParam + 1][colParam + 1].state = CellState.flagged;
                gameStore.decrementBombCounter();
            }
        }

        return newCells;
    };
    // const handleMouseDown = (
    //     event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    //     rowParam: number,
    //     colParam: number,
    // ): void => {
    //     gameStore.setFaceButtonValue(Face.find);
    //     if (event.button === MouseButtons.RightButton) {
    //         handleRightMouseButton(rowParam, colParam, true);
    //     }
    // };
    // const handleMouseUp = (
    //     event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    //     rowParam: number,
    //     colParam: number,
    // ): void => {
    //     gameStore.setFaceButtonValue(Face.smile);
    //     if (event.button === MouseButtons.RightButton) {
    //         handleRightMouseButton(rowParam, colParam, false);
    //     }
    // };

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

    const handleAutoCellClick = (rowParam: number, colParam: number): void => {
        if (!gameStore.isGameStarted && !gameStore.isGameLost && !gameStore.isGameWon) {
            let isFirstCellEmpty = gameStore.gameCells[rowParam][colParam].value === CellValue.empty;
            while (!isFirstCellEmpty) {
                gameStore.setStartCells(
                    gameSettingsStore.gameSettings.fieldHeight,
                    gameSettingsStore.gameSettings.fieldWidth,
                    gameSettingsStore.gameSettings.bombsQuantity,
                );

                if (gameStore.gameCells[rowParam][colParam].value === CellValue.empty) {
                    isFirstCellEmpty = true;
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
            // sendStatistics();
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
        // saveGame(newCells);
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
            // sendStatistics();
            playWinSound();
        }
        gameStore.setCells(cells);
    };

    const handleAutoRightCLick = (rowParam: number, colParam: number) => (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ): void => {
        // e.preventDefault();

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

    // const sendStatistics = () => {
    //     axios.post(
    //         'api/statistics',
    //         {
    //             list: {
    //                 level: gameSettingsStore.gameSettings.fieldSize,
    //                 statusWin: gameStore.isGameWon,
    //                 statusLost: gameStore.isGameLost,
    //                 gameMoves: gameStore.gameMoves,
    //                 time: gameStore.gameTime,
    //             },
    //         },
    //         {
    //             headers: {
    //                 authorization: authStore.token,
    //             },
    //         },
    //     );
    // };

    // const saveGame = (newCells: Cell[][]) => {
    //     const savedGame = newCells.map((row) => {
    //         return row.map((col) => {
    //             return toJS(col);
    //         });
    //     });
    //     const bombsCount = toJS(gameStore.bombCount);
    //     const gameTime = toJS(gameStore.gameTime);
    //     axios
    //         .patch(
    //             'api/gamesave',
    //             {
    //                 list: {
    //                     savedGame: savedGame,
    //                     bombsCount: bombsCount,
    //                     gameTime: gameTime,
    //                 },
    //             },
    //             {
    //                 headers: {
    //                     authorization: authStore.token,
    //                 },
    //             },
    //         )
    //         .then((response) => {
    //             // gameSettingsStore.setGameSettings(response.data.list[0]);
    //             // gameStore.setDefaultStartGameValues(
    //             //     gameSettingsStore.gameSettings.fieldHeight,
    //             //     gameSettingsStore.gameSettings.fieldWidth,
    //             //     gameSettingsStore.gameSettings.bombsQuantity,
    //             // );    // sendRequest();
    //         });
    // };

    // const useKey = (key: any, cb: any) => {
    //     const callbackRef = useRef(cb);

    //     useEffect(() => {
    //         callbackRef.current = cb;
    //     });

    //     useEffect(() => {
    //         const handle = (event: { code: any }) => {
    //             if (event.code === key) {
    //                 callbackRef.current(event);
    //             }
    //         };
    //         document.addEventListener('keypress', handle);
    //         return () => document.removeEventListener('keypress', handle);
    //     }, [key]);
    // };

    // const handleRestartGame = () => {
    //     console.log('ENTER');
    //     gameStore.setDefaultStartGameValues(
    //         gameSettingsStore.gameSettings.fieldHeight,
    //         gameSettingsStore.gameSettings.fieldWidth,
    //         gameSettingsStore.gameSettings.bombsQuantity,
    //     );
    // };

    // const handleStartKeyboardUse = () => {
    //     console.log('Start');
    //     const newCells = gameStore.gameCells.slice();
    //     newCells[gameStore.activeCellRow][gameStore.activeCellCol].active = true;
    //     gameStore.setCells(newCells);
    // };

    // const handleStopKeyboardUse = () => {
    //     const newCells = gameStore.gameCells.slice();
    //     newCells[gameStore.activeCellRow][gameStore.activeCellCol].active = false;
    //     gameStore.setCells(newCells);
    //     console.log('Stop');
    // };

    // const handleMoveUp = () => {
    //     if (gameStore.activeCellRow === 0) {
    //         return;
    //     } else {
    //         const newCells = gameStore.gameCells.slice();
    //         newCells[gameStore.activeCellRow][gameStore.activeCellCol].active = false;
    //         newCells[--gameStore.activeCellRow][gameStore.activeCellCol].active = true;
    //         gameStore.setCells(newCells);
    //     }
    // };
    // const handleMoveDown = () => {
    //     if (gameStore.activeCellRow === gameSettingsStore.gameSettings.fieldHeight - 1) {
    //         return;
    //     } else {
    //         const newCells = gameStore.gameCells.slice();
    //         newCells[gameStore.activeCellRow][gameStore.activeCellCol].active = false;
    //         newCells[++gameStore.activeCellRow][gameStore.activeCellCol].active = true;
    //         gameStore.setCells(newCells);
    //     }
    // };

    // const handleMoveLeft = () => {
    //     if (gameStore.activeCellCol === 0) {
    //         return;
    //     } else {
    //         const newCells = gameStore.gameCells.slice();
    //         newCells[gameStore.activeCellRow][gameStore.activeCellCol].active = false;
    //         newCells[gameStore.activeCellRow][--gameStore.activeCellCol].active = true;
    //         gameStore.setCells(newCells);
    //     }
    // };
    // const handleMoveRight = () => {
    //     if (gameStore.activeCellCol === gameSettingsStore.gameSettings.fieldWidth - 1) {
    //         return;
    //     } else {
    //         const newCells = gameStore.gameCells.slice();
    //         newCells[gameStore.activeCellRow][gameStore.activeCellCol].active = false;
    //         newCells[gameStore.activeCellRow][++gameStore.activeCellCol].active = true;
    //         gameStore.setCells(newCells);
    //     }
    // };

    // const handleLeftClick = () => {
    //     handleCellClick(gameStore.activeCellRow, gameStore.activeCellCol);
    // };

    // //TODO
    // const handleRightClick = () => {
    //     handleCellContext(gameStore.activeCellRow, gameStore.activeCellCol);
    // };

    // useKey(KEYBOARD_KEYS.RESTART_GAME, handleRestartGame);
    // useKey(KEYBOARD_KEYS.START_KEYBOARD_USE, handleStartKeyboardUse);

    // useKey(KEYBOARD_KEYS.STOP_KEYBOARD_USE, handleStopKeyboardUse);
    // useKey(KEYBOARD_KEYS.MOVE_UP, handleMoveUp);
    // useKey(KEYBOARD_KEYS.MOVE_DOWN, handleMoveDown);
    // useKey(KEYBOARD_KEYS.MOVE_LEFT, handleMoveLeft);
    // useKey(KEYBOARD_KEYS.MOVE_RIGHT, handleMoveRight);
    // useKey(KEYBOARD_KEYS.LEFT_CLICK, handleLeftClick);
    // useKey(KEYBOARD_KEYS.RIGHT_CLICK, handleRightClick);
    return (
        <div className="AutoPlayScreen">
            <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<FullscreenIcon />}
                onClick={handle.enter}
            >
                Full screen
            </Button>
            <FullScreen handle={handle}>
                <AutoPlayGameHeader />
                <AutoPlayGameBody />
                <button onClick={handleAutoplay}>handleAutoplay</button>
            </FullScreen>
        </div>
    );
};

export default AutoPlayScreen;
