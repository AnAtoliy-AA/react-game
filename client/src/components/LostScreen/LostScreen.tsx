import React from 'react';
import { Button } from '@material-ui/core';
import BackspaceIcon from '@material-ui/icons/Backspace';
import './LostScreen.scss';
import { useStore } from '../../hooks/hooks';
import { NavLink } from 'react-router-dom';
import { Spring } from 'react-spring/renderprops';
import { DEFAULT_FOREIGN_LANGUAGE, WORDS_CONFIG } from '../../constants';

const LostScreen = () => {
    const gameStore = useStore('gameStore');
    const gameSettingsStore = useStore('gameSettingsStore');
    const handleClick = () => {
        gameStore.setIsGameLost(false);
    };
    return (
        <div className="LostScreen">
            <Spring
                from={{ transform: 'translate3d(0,-40vh,0)' }}
                to={{ transform: 'translate3d(0,0vh,0)' }}
                config={{ duration: 2000 }}
            >
                {(props) => (
                    <div style={props}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={handleClick}
                            startIcon={<BackspaceIcon />}
                        >
                            {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                ? WORDS_CONFIG.BACK_BUTTON.foreign
                                : WORDS_CONFIG.BACK_BUTTON.native}
                        </Button>
                    </div>
                )}
            </Spring>
            <Spring
                from={{ transform: 'translate3d(0,-60vh,0)' }}
                to={{ transform: 'translate3d(0,0vh,0)' }}
                config={{ duration: 2000 }}
            >
                {(props) => (
                    <div style={props}>
                        {' '}
                        <div className="voluminos-text">
                            {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                ? WORDS_CONFIG.LOST_FIELD.foreign
                                : WORDS_CONFIG.LOST_FIELD.native}
                        </div>
                    </div>
                )}
            </Spring>
            <Spring
                from={{ transform: 'translate3d(0,-80vh,0)' }}
                to={{ transform: 'translate3d(0,0vh,0)' }}
                config={{ duration: 2000 }}
            >
                {(props) => (
                    <div style={props}>
                        <NavLink to="/main" style={{ textDecoration: 'none' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={handleClick}
                                startIcon={<BackspaceIcon />}
                            >
                                {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                    ? WORDS_CONFIG.BACK_TO_MAIN_BUTTON.foreign
                                    : WORDS_CONFIG.BACK_TO_MAIN_BUTTON.native}
                            </Button>
                        </NavLink>
                    </div>
                )}
            </Spring>
        </div>
    );
};

export default LostScreen;
