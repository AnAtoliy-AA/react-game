import { observer } from 'mobx-react-lite';
import React from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useStore } from '../../hooks/hooks';
import GameBody from '../GameBody/GameBody';
import GameHeader from '../GameHeader/GameHeader';
import './App.scss';

const App: React.FC = () => {
    const gameStore = useStore('gameStore');
    const handle = useFullScreenHandle();

    return (
        <div className="App">
            <div className="GameContainer">
                <button onClick={handle.enter}>Enter fullscreen</button>
                <FullScreen handle={handle}>
                    <GameHeader />
                    <GameBody />
                </FullScreen>
            </div>
            {gameStore.isGameLost && <div>LOST</div>}
            {gameStore.isGameWon && <div>WON</div>}
        </div>
    );
};

export default observer(App);
