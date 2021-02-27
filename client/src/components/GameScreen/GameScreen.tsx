import React, { useState } from 'react';
import './GameScreen.scss';
import GameBody from '../GameBody/GameBody';
import GameHeader from '../GameHeader/GameHeader';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import { Button } from '@material-ui/core';
import { useStore } from '../../hooks/hooks';
import { DEFAULT_FOREIGN_LANGUAGE, WORDS_CONFIG } from '../../constants';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/src/styles.scss';
import gameMusic from '../../assets/sounds/music.mp3';
import { FIELD_SIZES } from '../../constants';

const GameScreen: React.FC = () => {
    const gameSettingsStore = useStore('gameSettingsStore');
    const handle = useFullScreenHandle();
    const [isPlayerVisible, changePlayerVisiblity] = useState(false);
    return (
        <div className="GameScreen">
            <div className="game-controls">
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
                {gameSettingsStore.gameSettings.fieldSize !== FIELD_SIZES.LARGE.name && (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={isPlayerVisible ? <VolumeOffIcon /> : <VolumeMuteIcon />}
                        onClick={() => changePlayerVisiblity(!isPlayerVisible)}
                    >
                        {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                            ? WORDS_CONFIG.PLAY_BACKGROUND_MUSIC_BUTTON.foreign
                            : WORDS_CONFIG.PLAY_BACKGROUND_MUSIC_BUTTON.native}
                    </Button>
                )}
            </div>
            <FullScreen handle={handle}>
                <GameHeader />
                <GameBody />
            </FullScreen>
            {isPlayerVisible && (
                <AudioPlayer
                    autoPlay
                    loop
                    src={gameMusic}
                    onPlay={(e) => console.log('onPlay')}
                    volume={gameSettingsStore.gameSettings.gameMusicVolume}
                    // other props here
                />
            )}
        </div>
    );
};

export default GameScreen;
