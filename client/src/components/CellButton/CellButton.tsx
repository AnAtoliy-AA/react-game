import React from 'react';
import { useStore } from '../../hooks/hooks';

import { CellState, CellValue, Face } from '../../types';
import './CellButton.scss';

interface ButtonProps {
    row: number;
    col: number;
    state: CellState;
    value: CellValue;
}

// eslint-disable-next-line react/prop-types
const CellButton: React.FC<ButtonProps> = ({ row, col, state, value }) => {
    const gameStore = useStore('gameStore');
    const handleMouseDown = (): void => {
        gameStore.setFaceButtonValue(Face.find);
    };
    const handleMouseUp = (): void => {
        gameStore.setFaceButtonValue(Face.smile);
    };

    const handleCellClick = (rowParam: number, colParam: number): void => {
        if (!gameStore.isGameStarted) {
            // gameStore.setIsGameStarted(true);
            gameStore.toggleIsGameStarted();
            console.log(rowParam, colParam);
        }
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
        } else if (currentCell.state === CellState.flagged) {
            currentCells[rowParam][colParam].state = CellState.default;
            gameStore.setCells(currentCells);
        }
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
            className={`Button ${state === CellState.visible && 'visible'} value-${value}`}
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
