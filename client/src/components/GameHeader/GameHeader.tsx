import React, { useState } from 'react';
import FaceButton from '../FaceButton/FaceButton';
import NumberDisplay from '../NumberDisplay/NumberDisplay';
import './GameHeader.scss';

const GameHeader: React.FC = () => {
    const [time, setTime] = useState<number>(0);

    return (
        <div className="GameHeader">
            <NumberDisplay value={0} />
            <FaceButton />
            <NumberDisplay value={time} />
        </div>
    );
};

export default GameHeader;
