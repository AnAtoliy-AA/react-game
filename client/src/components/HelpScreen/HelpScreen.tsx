import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@material-ui/core';
import BackspaceIcon from '@material-ui/icons/Backspace';
import { useStore } from '../../hooks/hooks';
import { DEFAULT_FOREIGN_LANGUAGE, WORDS_CONFIG } from '../../constants';
import './HelpScreen.scss';

const HelpScreen: React.FC = () => {
    const gameSettingsStore = useStore('gameSettingsStore');
    return (
        <div className="HelpScreen">
            <div className="help-text">
                {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                    ? WORDS_CONFIG.GAME_RULES.foreign
                    : WORDS_CONFIG.GAME_RULES.native}
            </div>
            <div className="help-controls">
                <div className="help-controls-keys">
                    <div className="help-control-key">/</div>
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.START_KEYBOARD_USE.foreign
                        : WORDS_CONFIG.START_KEYBOARD_USE.native}
                </div>
                <div className="help-controls-keys">
                    <div className="help-control-key">*</div>
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.STOP_KEYBOARD_USE.foreign
                        : WORDS_CONFIG.STOP_KEYBOARD_USE.native}
                </div>
                <div className="help-controls-keys">
                    <div className="help-control-key control-key-advanced">Enter</div>
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.RESTART_GAME.foreign
                        : WORDS_CONFIG.RESTART_GAME.native}
                </div>
                <div className="help-controls-keys">
                    <div className="help-control-key">8</div>
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.MOVE_UP.foreign
                        : WORDS_CONFIG.MOVE_UP.native}
                </div>
                <div className="help-controls-keys">
                    <div className="help-control-key">2</div>
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.MOVE_DOWN.foreign
                        : WORDS_CONFIG.MOVE_DOWN.native}
                </div>
                <div className="help-controls-keys">
                    <div className="help-control-key">4</div>
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.MOVE_LEFT.foreign
                        : WORDS_CONFIG.MOVE_LEFT.native}
                </div>
                <div className="help-controls-keys">
                    <div className="help-control-key">6</div>
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.MOVE_RIGHT.foreign
                        : WORDS_CONFIG.MOVE_RIGHT.native}
                </div>
                <div className="help-controls-keys">
                    <div className="help-control-key">5</div>
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.LEFT_CLICK.foreign
                        : WORDS_CONFIG.LEFT_CLICK.native}
                </div>
                <div className="help-controls-keys">
                    <div className="help-control-key">0</div>
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.RIGHT_CLICK.foreign
                        : WORDS_CONFIG.RIGHT_CLICK.native}
                </div>
            </div>
            <NavLink to="/main" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" size="small" startIcon={<BackspaceIcon />}>
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.BACK_BUTTON.foreign
                        : WORDS_CONFIG.BACK_BUTTON.native}
                </Button>
            </NavLink>
        </div>
    );
};

export default HelpScreen;
