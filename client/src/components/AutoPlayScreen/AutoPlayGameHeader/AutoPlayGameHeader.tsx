import { observer } from 'mobx-react-lite';
import React from 'react';
import { useEffect } from 'react';
import { useStore } from '../../../hooks/hooks';
import FaceButton from '../../FaceButton/FaceButton';
import NumberDisplay from '../../NumberDisplay/NumberDisplay';
import './AutoPlayGameHeader.scss';

const AutoPlayGameHeader: React.FC = () => {
    const gameStore = useStore('gameStore');

    useEffect(() => {
        let interval: number | undefined;

        if (gameStore.isGameStarted) {
            interval = window.setInterval(() => {
                gameStore.setGameTime(++gameStore.gameTime);
            }, 1000);

            return () => {
                window.clearInterval(interval);
            };
        }

        if (gameStore.isGameWon || gameStore.isGameLost) {
            window.clearInterval(interval);
        }
    }, [gameStore.isGameStarted]);

    return (
        <div className="AutoPlayGameHeader">
            <NumberDisplay value={gameStore.bombCount} />
            <FaceButton />
            <NumberDisplay value={gameStore.gameTime} />
        </div>
    );
};

export default observer(AutoPlayGameHeader);
