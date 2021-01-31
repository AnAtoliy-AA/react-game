import React from 'react';
import FaceButton from '../FaceButton/FaceButton';
import NumberDisplay from '../NumberDisplay/NumberDisplay';
import './GameHeader.scss';

const GameHeader: React.FC = () => {
    return (
        <div className="GameHeader">
            <NumberDisplay value={0} />
            <FaceButton />
            <NumberDisplay value={0} />
        </div>
    );
};

export default GameHeader;
