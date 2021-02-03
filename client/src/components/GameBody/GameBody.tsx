import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../hooks/hooks';
import CellButton from '../CellButton/CellButton';
import './GameBody.scss';

const GameBody: React.FC = () => {
    const gameStore = useStore('gameStore');
    const renderCells = (): React.ReactNode => {
        return gameStore.gameCells.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
                <CellButton
                    key={`${rowIndex}${colIndex}`}
                    state={cell.state}
                    value={cell.value}
                    danger={cell.danger}
                    checked={cell.checked}
                    row={rowIndex}
                    col={colIndex}
                />
            )),
        );
    };

    return <div className="GameBody">{renderCells()}</div>;
};

export default observer(GameBody);
