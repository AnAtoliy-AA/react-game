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
    gameStore.toggleIsCellClicked();
    const handleMouseUp = (): void => {
        gameStore.setFaceButtonValue(Face.smile);
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
        >
            {renderContent()}
        </div>
    );
};

export default CellButton;
