import React, { useState } from 'react';
import { generateCells } from '../../utils';
import CellButton from '../CellButton/CellButton';
import './GameBody.scss';

const GameBody: React.FC = () => {
    const [cells, setCells] = useState(generateCells());
    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) => row.map((cell, colIndex) => <CellButton key={`${rowIndex}${colIndex}`} />));
    };

    return <div className="GameBody">{renderCells()}</div>;
};

export default GameBody;
