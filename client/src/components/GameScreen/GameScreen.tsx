import React from 'react';
import './GameScreen.scss';
import GameBody from '../GameBody/GameBody';
import GameHeader from '../GameHeader/GameHeader';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { Button } from '@material-ui/core';
import { useStore } from '../../hooks/hooks';
import { DEFAULT_FOREIGN_LANGUAGE, WORDS_CONFIG } from '../../constants';

const GameScreen: React.FC = () => {
    const gameSettingsStore = useStore('gameSettingsStore');
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
                {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                    ? WORDS_CONFIG.FULL_SCREEN_BUTTON.foreign
                    : WORDS_CONFIG.FULL_SCREEN_BUTTON.native}
            </Button>
            <FullScreen handle={handle}>
                <GameHeader />
                <GameBody />
            </FullScreen>
        </div>
    );
};

export default GameScreen;
