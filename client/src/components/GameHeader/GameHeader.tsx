import { observer } from 'mobx-react-lite';
import React, { ReactInstance, useEffect, useState } from 'react';
import { clearInterval } from 'timers';
import { useStore } from '../../hooks/hooks';
import FaceButton from '../FaceButton/FaceButton';
import NumberDisplay from '../NumberDisplay/NumberDisplay';
import './GameHeader.scss';

const GameHeader: React.FC = () => {
    const gameStore = useStore('gameStore');
    const [time, setTime] = useState<number>(0);

    // useEffect(() => {
    //     if (gameStore.isGameStarted) {
    //         const gameTimer = setInterval(() => {
    //             setTime(time + 1);
    //         }, 1000);

    //         return () => {
    //             clearInterval(gameTimer);
    //         };
    //     }
    // }, [gameStore.isGameStarted, time]);

    // if (!gameStore.isGameStarted) {
    // }

    return (
        <div className="GameHeader">
            <NumberDisplay value={0} />
            <FaceButton />
            <NumberDisplay value={time} />
        </div>
    );
};

export default observer(GameHeader);
