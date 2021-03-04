import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../hooks/hooks';
import { Face } from '../../types';
import './FaceButton.scss';

const FaceButton: React.FC = observer(() => {
    const gameStore = useStore('gameStore');
    const gameSettingsStore = useStore('gameSettingsStore');

    const handleOnFaceClick = (): void => {
        gameStore.setDefaultStartGameValues(
            gameSettingsStore.gameSettings.fieldHeight,
            gameSettingsStore.gameSettings.fieldWidth,
            gameSettingsStore.gameSettings.bombsQuantity,
        );
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
