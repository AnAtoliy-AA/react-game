import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../hooks/hooks';
import FaceButton from '../FaceButton/FaceButton';
import NumberDisplay from '../NumberDisplay/NumberDisplay';
import './GameHeader.scss';

const GameHeader: React.FC = () => {
    const gameStore = useStore('gameStore');

    return (
        <div className="GameHeader">
            <NumberDisplay value={gameStore.bombCount} />
            <FaceButton />
            <NumberDisplay value={gameStore.gameTime} />
        </div>
    );
};

export default observer(GameHeader);
