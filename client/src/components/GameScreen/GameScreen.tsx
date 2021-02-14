import React from 'react';
import './GameScreen.scss';
import GameBody from '../GameBody/GameBody';
import GameHeader from '../GameHeader/GameHeader';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { Button } from '@material-ui/core';

const GameScreen: React.FC = () => {
    const handle = useFullScreenHandle();
    return (
        <div className="GameScreen">
            <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<FullscreenIcon />}
                onClick={handle.enter}
            >
                Full screen
            </Button>
            <FullScreen handle={handle}>
                <GameHeader />
                <GameBody />
            </FullScreen>
        </div>
    );
};

export default GameScreen;
