import React from 'react';
import { DEFAULT_FOREIGN_LANGUAGE, WORDS_CONFIG } from '../../constants';
import { useStore } from '../../hooks/hooks';
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
                TODO
                <div className="help-controls-keys">
                    NumpadDivide:
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.START_KEYBOARD_USE.foreign
                        : WORDS_CONFIG.START_KEYBOARD_USE.native}
                </div>
                <div className="help-controls-keys">
                    NumpadMultiply:
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.STOP_KEYBOARD_USE.foreign
                        : WORDS_CONFIG.STOP_KEYBOARD_USE.native}
                </div>
                <div className="help-controls-keys">
                    NumpadEnter
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.RESTART_GAME.foreign
                        : WORDS_CONFIG.RESTART_GAME.native}
                </div>
                <div className="help-controls-keys">
                    Numpad8
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.MOVE_UP.foreign
                        : WORDS_CONFIG.MOVE_UP.native}
                </div>
                <div className="help-controls-keys">
                    Numpad2
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.MOVE_DOWN.foreign
                        : WORDS_CONFIG.MOVE_DOWN.native}
                </div>
                <div className="help-controls-keys">
                    Numpad4
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.MOVE_LEFT.foreign
                        : WORDS_CONFIG.MOVE_LEFT.native}
                </div>
                <div className="help-controls-keys">
                    Numpad6
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.MOVE_RIGHT.foreign
                        : WORDS_CONFIG.MOVE_RIGHT.native}
                </div>
                <div className="help-controls-keys">
                    Numpad5
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.LEFT_CLICK.foreign
                        : WORDS_CONFIG.LEFT_CLICK.native}
                </div>
                <div className="help-controls-keys">
                    Numpad0
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.RIGHT_CLICK.foreign
                        : WORDS_CONFIG.RIGHT_CLICK.native}
                </div>
            </div>
        </div>
    );
};

export default HelpScreen;
