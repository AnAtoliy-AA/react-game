import React from 'react';
import { useStore } from '../../hooks/hooks';
import { CellState, CellValue } from '../../types';
import './CellButton.scss';

interface ButtonProps {
    row: number;
    col: number;
    danger?: boolean;
    checked?: boolean;
    active?: boolean;
    state: CellState;
    value: CellValue;
}

const CELL_SIZE = 30;

// eslint-disable-next-line react/prop-types
const CellButton: React.FC<ButtonProps> = ({ state, value, danger, checked, active, row, col }) => {
    const gameSettingsStore = useStore('gameSettingsStore');
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
            className={`Button ${state === CellState.visible && 'visible'} value-${value} ${danger ? 'danger' : ''}
               ${gameSettingsStore.gameSettings.fieldStyle === 'Custom' ? 'custom' : ''} ${checked ? 'checked' : ''} ${
                active ? 'active' : ''
            }`}
            style={{ backgroundPosition: `-${col * CELL_SIZE}px -${row * CELL_SIZE}px` }}
        >
            {renderContent()}
        </div>
    );
};

export default CellButton;
