import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../hooks/hooks';
import { Face } from '../../types';
import './FaceButton.scss';

const FaceButton: React.FC = observer(() => {
    const gameStore = useStore('gameStore');

    const handleOnFaceClick = (): void => {
        gameStore.setIsGameStarted(false);
        gameStore.setStartCells();
        gameStore.setDefaultBombCount();
        gameStore.setIsGameWon(false);
        gameStore.setFaceButtonValue(Face.smile);
    };

    if (gameStore.isGameWon) {
        gameStore.setFaceButtonValue(Face.win);
    }

    return (
        <div className="FaceButton" onClick={handleOnFaceClick}>
            {gameStore.FaceButtonValue}
        </div>
    );
});

export default FaceButton;
