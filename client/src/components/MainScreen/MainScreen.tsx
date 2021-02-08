import React from 'react';
import './MainScreen.scss';
import GameBody from '../GameBody/GameBody';
import GameHeader from '../GameHeader/GameHeader';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

const MainScreen: React.FC = () => {
    const handle = useFullScreenHandle();
    return (
        <div className="MainScreen">
            <button onClick={handle.enter}>Enter fullscreen</button>
            <FullScreen handle={handle}>
                <GameHeader />
                <GameBody />
            </FullScreen>
        </div>
    );
};

export default MainScreen;
