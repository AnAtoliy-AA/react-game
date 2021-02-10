import React from 'react';
import './GameScreen.scss';
import GameBody from '../GameBody/GameBody';
import GameHeader from '../GameHeader/GameHeader';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

const GameScreen: React.FC = () => {
    const handle = useFullScreenHandle();
    return (
        <div className="GameScreen">
            <button onClick={handle.enter}>Enter fullscreen</button>
            <FullScreen handle={handle}>
                <GameHeader />
                <GameBody />
            </FullScreen>
        </div>
    );
};

export default GameScreen;
