import axios from 'axios';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../hooks/hooks';
import './GameStatistic.scss';

const GameStatistic: React.FC = () => {
    const authStore = useStore('authStore');
    const gameStore = useStore('gameStore');
    const gameSettingsStore = useStore('gameSettingsStore');

    if (gameStore.isGameWon || gameStore.isGameLost) {
        // axios.post(
        //     'api/statistics',
        //     {
        //         list: {
        //             level: gameSettingsStore.gameSettings.fieldStyle,
        //             status: gameStore.isGameWon,
        //             time: gameStore.gameTime,
        //         },
        //     },
        //     {
        //         headers: {
        //             authorization: authStore.token,
        //         },
        //     },
        // );
    }

    return <div className="GameStatistic">GameStatistic Component</div>;
};

export default observer(GameStatistic);
