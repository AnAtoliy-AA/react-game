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
import { checkMultipleVisibleCells, grabAllAdjacentCells, openMultipleEmptyCells } from '../../utils';
import { Button } from '@material-ui/core';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import BrightnessAutoIcon from '@material-ui/icons/BrightnessAuto';
import { DEFAULT_FOREIGN_LANGUAGE, WORDS_CONFIG } from '../../constants';

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
            currentCells.forEach((row, rowIndex) => {
                row.forEach((col, colIndex) => {
                    if (currentCells[rowIndex][colIndex].state === CellState.visible) {
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
                    }
                });
            });
            gameStore.setCells(currentCells);
            checkIfGameIsWon(currentCells);
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
            </FullScreen>
        </div>
    );
};

export default AutoPlayScreen;
