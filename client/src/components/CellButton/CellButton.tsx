import React from 'react';
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

// eslint-disable-next-line react/prop-types
const CellButton: React.FC<ButtonProps> = ({ state, value, danger, checked, active }) => {
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
             ${active ? 'active' : ''} ${checked ? 'checked' : ''}`}
        >
            {renderContent()}
        </div>
    );
};

export default CellButton;
