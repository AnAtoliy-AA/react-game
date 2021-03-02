import React, { useEffect } from 'react';
import './AutoPlayScreen.scss';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import AutoPlayGameHeader from './AutoPlayGameHeader/AutoPlayGameHeader';
import AutoPlayGameBody from './AutoPlayGameBody/AutoPlayGameBody';
import { useStore } from '../../hooks/hooks';
import useSound from 'use-sound';
import lostSound from '../../assets/sounds/failure.mp3';
import winSound from '../../assets/sounds/success.mp3';
import { Cell, CellState, CellValue } from '../../types';
import { checkMultipleVisibleCells, grabAllAdjacentCells, openMultipleEmptyCells } from '../../utils';
import { Button } from '@material-ui/core';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import BrightnessAutoIcon from '@material-ui/icons/BrightnessAuto';
import { DEFAULT_FOREIGN_LANGUAGE, WORDS_CONFIG } from '../../constants';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';

const AUTO_PLAY_PARAMS = {
    FIELD_WIDTH: 9,
    FIELD_HEIGHT: 9,
    BOMBS_COUNT: 10,
};

const AutoPlayScreen: React.FC = () => {
    const handle = useFullScreenHandle();
    const gameStore = useStore('gameStore');
    const gameSettingsStore = useStore('gameSettingsStore');
    const [playLostSound] = useSound(lostSound, { volume: gameSettingsStore.gameSettings.gameSoundVolume });
    const [playWinSound] = useSound(winSound, { volume: gameSettingsStore.gameSettings.gameSoundVolume });
    const handleAutoplay = () => {
        gameStore.setIsAutoplayGameChanged(true);
        console.log('auto');
        gameStore.setDefaultStartGameValues(
            AUTO_PLAY_PARAMS.FIELD_HEIGHT,
            AUTO_PLAY_PARAMS.FIELD_WIDTH,
            AUTO_PLAY_PARAMS.BOMBS_COUNT,
        );
        setTimeout(() => {
            handleAutoCellClick(
                Math.round(AUTO_PLAY_PARAMS.FIELD_HEIGHT / 2),
                Math.round(AUTO_PLAY_PARAMS.FIELD_WIDTH / 2),
            );
        }, 1000);

        const timer = setInterval(() => {
            const currentCells = gameStore.gameCells.slice();
            const cellsArrayJsBeforeIteration = toJS(gameStore.gameCells);
            const cellsArrayJsonBeforeIteration = JSON.stringify(cellsArrayJsBeforeIteration);
            currentCells.map((row, rowIndex) => {
                row.map((col, colIndex) => {
                    if (currentCells[rowIndex][colIndex].state === CellState.visible) {
                        checkAutoMultipleDefaultCells(
                            currentCells,
                            rowIndex,
                            colIndex,
                            AUTO_PLAY_PARAMS.FIELD_HEIGHT,
                            AUTO_PLAY_PARAMS.FIELD_WIDTH,
                        );
                        checkAutoMultipleVisibleCells(
                            currentCells,
                            rowIndex,
                            colIndex,
                            AUTO_PLAY_PARAMS.FIELD_HEIGHT,
                            AUTO_PLAY_PARAMS.FIELD_WIDTH,
                        );
                    }
                });
            });

            // gameStore.setCells(currentCells);
            checkIfGameIsWon(currentCells);
            // if (!gameStore.isAutoGameChanged) {
            //     gameStore.setIsGameStarted(false);
            //     clearInterval(timer);
            //     console.log('aa');
            // }

            const cellsArrayJsAfterIteration = toJS(gameStore.gameCells);
            const chcellsArrayJsonAfterIteration = JSON.stringify(cellsArrayJsAfterIteration);
            if (chcellsArrayJsonAfterIteration === cellsArrayJsonBeforeIteration) {
                gameStore.setIsAutoplayGameChanged(false);
                gameStore.setIsGameStarted(false);
                clearInterval(timer);
                console.log('No more moves');
            }
            if (gameStore.isGameWon || gameStore.bombCount === 0) {
                currentCells.map((row, rowIndex) => {
                    row.map((col, colIndex) => {
                        if (currentCells[rowIndex][colIndex].state === CellState.default) {
                            currentCells[rowIndex][colIndex].state = CellState.visible;
                        }
                    });
                });
                gameStore.setIsGameStarted(false);
                gameStore.setCells(currentCells);
                clearInterval(timer);
            }
        }, 3000);
    };

    // useEffect(() => {
    //     console.log('changed');
    // }, [gameStore.gameCells]);

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
                gameStore.setIsAutoplayGameChanged(true);
            }
            if (topCell?.state === CellState.default) {
                newCells[rowParam - 1][colParam].state = CellState.flagged;
                gameStore.decrementBombCounter();
                gameStore.setIsAutoplayGameChanged(true);
            }
            if (topRightCell?.state === CellState.default) {
                newCells[rowParam - 1][colParam + 1].state = CellState.flagged;
                gameStore.decrementBombCounter();
                gameStore.setIsAutoplayGameChanged(true);
            }
            if (leftCell?.state === CellState.default) {
                newCells[rowParam][colParam - 1].state = CellState.flagged;
                gameStore.decrementBombCounter();
                gameStore.setIsAutoplayGameChanged(true);
            }
            if (rightCell?.state === CellState.default) {
                newCells[rowParam][colParam + 1].state = CellState.flagged;
                gameStore.decrementBombCounter();
                gameStore.setIsAutoplayGameChanged(true);
            }
            if (bottomLeftCell?.state === CellState.default) {
                newCells[rowParam + 1][colParam - 1].state = CellState.flagged;
                gameStore.decrementBombCounter();
                gameStore.setIsAutoplayGameChanged(true);
            }
            if (bottomCell?.state === CellState.default) {
                newCells[rowParam + 1][colParam].state = CellState.flagged;
                gameStore.decrementBombCounter();
                gameStore.setIsAutoplayGameChanged(true);
            }
            if (bottomRightCell?.state === CellState.default) {
                newCells[rowParam + 1][colParam + 1].state = CellState.flagged;
                gameStore.decrementBombCounter();
                gameStore.setIsAutoplayGameChanged(true);
            }
        }

        return newCells;
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
        gameStore.setIsAutoplayGameChanged(true);
        gameStore.incrementGameMoves();
        checkIfGameIsWon(newCells);
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
            playWinSound();
        }
        gameStore.setCells(cells);
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

    const checkAutoMultipleVisibleCells = (
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

        let numberOfFlags = 0;

        if (topLeftCell?.state === CellState.flagged) {
            numberOfFlags++;
        }
        if (topCell?.state === CellState.flagged) {
            numberOfFlags++;
        }
        if (topRightCell?.state === CellState.flagged) {
            numberOfFlags++;
        }
        if (leftCell?.state === CellState.flagged) {
            numberOfFlags++;
        }
        if (rightCell?.state === CellState.flagged) {
            numberOfFlags++;
        }
        if (bottomLeftCell?.state === CellState.flagged) {
            numberOfFlags++;
        }
        if (bottomCell?.state === CellState.flagged) {
            numberOfFlags++;
        }
        if (bottomRightCell?.state === CellState.flagged) {
            numberOfFlags++;
        }

        if (numberOfFlags < currentCell.value) {
            // console.log('LOOK Better');
            //TODO
        } else openMultipleEmptyCells(cells, rowParam, colParam, fieldHeight, fieldWidth);

        return newCells;
    };

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
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleAutoplay}
                    startIcon={<BrightnessAutoIcon />}
                >
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.AUTOPLAY_BUTTON.foreign
                        : WORDS_CONFIG.AUTOPLAY_BUTTON.native}
                </Button>
                {/* {gameStore.isAutoGameChanged && <div>Changed</div>} */}
                {!gameStore.isAutoGameChanged && <div>No more moves</div>}
            </FullScreen>
        </div>
    );
};

export default observer(AutoPlayScreen);
