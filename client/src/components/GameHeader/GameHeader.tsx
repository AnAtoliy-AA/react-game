import React from 'react';
import NumberDisplay from '../NumberDisplay/NumberDisplay';
import './GameHeader.scss';

const GameHeader: React.FC = () => {
    return (
        <div className="GameHeader">
            <NumberDisplay value={0} />
            <NumberDisplay value={0} />
        </div>
    );
};

export default GameHeader;
