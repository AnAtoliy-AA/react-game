import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../hooks/hooks';
import { Face } from '../../types';
import './FaceButton.scss';

const FaceButton: React.FC = observer(() => {
    const gameStore = useStore('gameStore');

    const handleOnFaceClick = (): void => {
        gameStore.setDefaultStartGameValues();
    };

    if (gameStore.isGameWon) {
        gameStore.setFaceButtonValue(Face.win);
    }

    if (gameStore.isGameLost) {
        gameStore.setFaceButtonValue(Face.loose);
    }

    return (
        <div className="FaceButton" onClick={handleOnFaceClick}>
            {gameStore.FaceButtonValue}
        </div>
    );
});

export default FaceButton;
