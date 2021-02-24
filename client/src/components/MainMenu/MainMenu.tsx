import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './MainMenu.scss';
import { useTransition, animated, config } from 'react-spring';
import { Spring } from 'react-spring/renderprops';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import BrightnessAutoIcon from '@material-ui/icons/BrightnessAuto';
import SettingsIcon from '@material-ui/icons/Settings';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import bgImgFirst from '../../assets/images/menu_bg_1.jpg';
import bgImgSec from '../../assets/images/menu_bg_2.jpg';
import bgImgThird from '../../assets/images/menu_bg-3.jpg';
import bgImgFourth from '../../assets/images/menu_bg_4.jpg';
import { Button } from '@material-ui/core';
import { useStore } from '../../hooks/hooks';
import { DEFAULT_FOREIGN_LANGUAGE, WORDS_CONFIG } from '../../constants';
import { observer } from 'mobx-react-lite';

const slides = [
    { id: 0, url: bgImgFirst },
    {
        id: 1,
        url: bgImgSec,
    },
    { id: 2, url: bgImgThird },
    { id: 3, url: bgImgFourth },
];

const MainMenu: React.FC = () => {
    const gameSettingsStore = useStore('gameSettingsStore');
    const [index, set] = useState(0);
    const transitions = useTransition(slides[index], (item) => item.id, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: config.molasses,
    });
    useEffect(() => void setInterval(() => set((state) => (state + 1) % 4), 5000), []);
    return (
        <div className="main-menu">
            {transitions.map(({ item, props, key }) => (
                <animated.div
                    key={key}
                    className="bg"
                    style={{
                        ...props,
                        backgroundImage: `url(${item.url})`,
                    }}
                />
            ))}
            <Spring
                from={{ transform: 'translate3d(0,-20vh,0)' }}
                to={{ transform: 'translate3d(0,0vh,0)' }}
                config={{ duration: 1000 }}
            >
                {(props) => (
                    <div style={props}>
                        <NavLink to="/game" className="menu-nav">
                            <Button variant="contained" color="primary" size="large" startIcon={<BrightnessHighIcon />}>
                                {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                    ? WORDS_CONFIG.START_BUTTON.foreign
                                    : WORDS_CONFIG.START_BUTTON.native}
                            </Button>
                        </NavLink>
                    </div>
                )}
            </Spring>
            <Spring
                from={{ transform: 'translate3d(0,-40vh,0)' }}
                to={{ transform: 'translate3d(0,0vh,0)' }}
                config={{ duration: 1500 }}
            >
                {(props) => (
                    <div style={props}>
                        <NavLink to="/autoplay" className="menu-nav">
                            <Button variant="contained" color="primary" size="large" startIcon={<BrightnessAutoIcon />}>
                                {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                    ? WORDS_CONFIG.AUTOPLAY_BUTTON.foreign
                                    : WORDS_CONFIG.AUTOPLAY_BUTTON.native}
                            </Button>
                        </NavLink>
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
                        <NavLink to="/settings" className="menu-nav">
                            <Button variant="contained" color="primary" size="large" startIcon={<SettingsIcon />}>
                                {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                    ? WORDS_CONFIG.SETTINGS_BUTTON.foreign
                                    : WORDS_CONFIG.SETTINGS_BUTTON.native}
                            </Button>
                        </NavLink>
                    </div>
                )}
            </Spring>
            <Spring
                from={{ transform: 'translate3d(0,-80vh,0)' }}
                to={{ transform: 'translate3d(0,0vh,0)' }}
                config={{ duration: 2500 }}
            >
                {(props) => (
                    <div style={props}>
                        <NavLink to="/statistics" className="menu-nav">
                            <Button variant="contained" color="primary" size="large" startIcon={<EqualizerIcon />}>
                                {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                    ? WORDS_CONFIG.STATISTICS_BUTTON.foreign
                                    : WORDS_CONFIG.STATISTICS_BUTTON.native}
                            </Button>
                        </NavLink>
                    </div>
                )}
            </Spring>
            <Spring
                from={{ transform: 'translate3d(0,-100vh,0)' }}
                to={{ transform: 'translate3d(0,0vh,0)' }}
                config={{ duration: 3000 }}
            >
                {(props) => (
                    <div style={props}>
                        <NavLink to="/help" className="menu-nav">
                            <Button variant="contained" color="primary" size="large" startIcon={<HelpOutlineIcon />}>
                                {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                    ? WORDS_CONFIG.HELP_BUTTON.foreign
                                    : WORDS_CONFIG.HELP_BUTTON.native}
                            </Button>
                        </NavLink>
                    </div>
                )}
            </Spring>
        </div>
    );
};

export default observer(MainMenu);
