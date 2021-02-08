import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../hooks/hooks';
import GameBody from '../GameBody/GameBody';
import GameHeader from '../GameHeader/GameHeader';
import './App.scss';

const App: React.FC = () => {
    const gameStore = useStore('gameStore');
    return (
        <div className="App">
            <GameHeader />
            <GameBody />
            {gameStore.isGameLost && <div>LOST</div>}
            {gameStore.isGameWon && <div>WON</div>}
        </div>
    );
};

export default observer(App);
