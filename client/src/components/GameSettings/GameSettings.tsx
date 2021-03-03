import React from 'react';
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SaveIcon from '@material-ui/icons/Save';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './GameSettings.scss';
import { useStore } from '../../hooks/hooks';
import { FIELD_SIZES } from '../../constants';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DEFAULT_FOREIGN_LANGUAGE, WORDS_CONFIG } from '../../constants';
import { useState } from 'react';

const GameSettings: React.FC = () => {
    return (
        <div className="settings-screen">
            <GameSettingsForm />
        </div>
    );
};

export default GameSettings;

export const GameSettingsForm = observer(() => {
    const authStore = useStore('authStore');
    const gameSettingsStore = useStore('gameSettingsStore');
    const gameStore = useStore('gameStore');
    const [fieldSize, setFieldSize] = React.useState(gameSettingsStore.gameSettings.fieldSize);
    const [fieldWidth, setFieldWidth] = React.useState(gameSettingsStore.gameSettings.fieldWidth);
    const [fieldHeight, setFieldHeight] = React.useState(gameSettingsStore.gameSettings.fieldHeight);
    const [bombsQuantity, setBombsQuantity] = React.useState(gameSettingsStore.gameSettings.bombsQuantity);
    const [fieldStyle, setFieldStyle] = React.useState(gameSettingsStore.gameSettings.fieldStyle);
    //TODO
    const [gameSoundVolume, setGameSoundVolume] = React.useState(gameSettingsStore.gameSettings.gameSoundVolume);
    const [gameMusicVolume, setGameMusicVolume] = React.useState(gameSettingsStore.gameSettings.gameMusicVolume);
    const [gameLanguage, setGameLanguage] = React.useState(gameSettingsStore.gameSettings.gameLanguage);

    const [responseMessage, setResponseMessage] = useState('');
    const { handleSubmit } = useForm();
    const onSubmit = () => {
        axios
            .patch(
                'api/settings',
                {
                    list: {
                        fieldSize: fieldSize,
                        fieldWidth: fieldWidth,
                        fieldHeight: fieldHeight,
                        bombsQuantity: bombsQuantity,
                        fieldStyle: fieldStyle,
                        gameSoundVolume: gameSoundVolume,
                        gameMusicVolume: gameMusicVolume,
                        gameLanguage: gameLanguage,
                    },
                },
                {
                    headers: {
                        authorization: authStore.token,
                    },
                },
            )
            .then((response) => {
                gameSettingsStore.setGameSettings(response.data.list[0]);
                gameStore.setDefaultStartGameValues(
                    gameSettingsStore.gameSettings.fieldHeight,
                    gameSettingsStore.gameSettings.fieldWidth,
                    gameSettingsStore.gameSettings.bombsQuantity,
                );
                setResponseMessage(response.statusText);
            });
    };

    const selectFieldSizeValues = (fieldSize: string) => {
        switch (fieldSize) {
            case FIELD_SIZES.SMALL.name:
                setFieldWidth(FIELD_SIZES.SMALL.fieldWidth);
                setFieldHeight(FIELD_SIZES.SMALL.fieldHeight);
                setBombsQuantity(FIELD_SIZES.SMALL.bombsQuantity);
                break;
            case FIELD_SIZES.MEDIUM.name:
                setFieldWidth(FIELD_SIZES.MEDIUM.fieldWidth);
                setFieldHeight(FIELD_SIZES.MEDIUM.fieldHeight);
                setBombsQuantity(FIELD_SIZES.MEDIUM.bombsQuantity);
                break;
            case FIELD_SIZES.LARGE.name:
                setFieldWidth(FIELD_SIZES.LARGE.fieldWidth);
                setFieldHeight(FIELD_SIZES.LARGE.fieldHeight);
                setBombsQuantity(FIELD_SIZES.LARGE.bombsQuantity);
                break;
        }
    };

    const handleSizeChange = (event: any) => {
        selectFieldSizeValues(event.target.value);
        setFieldSize(event.target.value);
    };
    const handleStyleChange = (event: any) => {
        setFieldStyle(event.target.value);
    };

    const handleLanguageChange = (event: any) => {
        setGameLanguage(event.target.value);
    };

    const handleSoundOn = () => {
        setGameSoundVolume(gameSettingsStore.gameSettings.gameSoundVolume);
    };

    const handleSoundOff = () => {
        setGameSoundVolume(0);
    };

    const handleSoundUp = () => {
        setGameSoundVolume(+(gameSoundVolume + 0.1).toFixed(1));
    };

    const handleSoundDown = () => {
        setGameSoundVolume(+(gameSoundVolume - 0.1).toFixed(1));
    };
    const handleMusicOn = () => {
        setGameMusicVolume(gameSettingsStore.gameSettings.gameSoundVolume);
    };

    const handleMusicOff = () => {
        setGameMusicVolume(0);
    };

    const handleMusicUp = () => {
        setGameMusicVolume(+(gameMusicVolume + 0.1).toFixed(1));
    };

    const handleMusicDown = () => {
        setGameMusicVolume(+(gameMusicVolume - 0.1).toFixed(1));
    };
    return (
        <div>
            <h2 className="">
                {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                    ? WORDS_CONFIG.SETTINGS_BUTTON.foreign
                    : WORDS_CONFIG.SETTINGS_BUTTON.native}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="settings-form">
                <div className="settings-field">
                    <FormControl variant="filled">
                        <InputLabel id="demo-simple-select-filled-label">
                            {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                ? WORDS_CONFIG.FIELD_SIZE_NAME.foreign
                                : WORDS_CONFIG.FIELD_SIZE_NAME.native}
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            name="fieldSize"
                            value={fieldSize || gameSettingsStore.gameSettings.fieldSize}
                            onChange={handleSizeChange}
                        >
                            <MenuItem value={FIELD_SIZES.SMALL.name}>9x9</MenuItem>
                            <MenuItem value={FIELD_SIZES.MEDIUM.name}>16x16</MenuItem>
                            <MenuItem value={FIELD_SIZES.LARGE.name}>30X16</MenuItem>
                        </Select>
                        <FormHelperText>
                            {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                ? WORDS_CONFIG.FIELD_SIZE_NAME_ADD.foreign
                                : WORDS_CONFIG.FIELD_STYLE_NAME_ADD.native}
                        </FormHelperText>
                    </FormControl>
                </div>
                <div className="settings-field">
                    <FormControl variant="filled">
                        <InputLabel id="demo-simple-select-filled-label">
                            {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                ? WORDS_CONFIG.FIELD_STYLE_NAME.foreign
                                : WORDS_CONFIG.FIELD_STYLE_NAME.native}
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            name="fieldStyle"
                            value={fieldStyle || gameSettingsStore.gameSettings.fieldStyle}
                            onChange={handleStyleChange}
                        >
                            <MenuItem value={'Classic'}>
                                {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                    ? WORDS_CONFIG.FIELD_STYLE_NAME_CLASSIC.foreign
                                    : WORDS_CONFIG.FIELD_STYLE_NAME_CLASSIC.native}
                            </MenuItem>
                            <MenuItem value={'Custom'}>
                                {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                    ? WORDS_CONFIG.FIELD_STYLE_NAME_CUSTOM.foreign
                                    : WORDS_CONFIG.FIELD_STYLE_NAME_CUSTOM.native}
                            </MenuItem>
                        </Select>
                        <FormHelperText>
                            {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                ? WORDS_CONFIG.FIELD_STYLE_NAME_ADD.foreign
                                : WORDS_CONFIG.FIELD_STYLE_NAME_ADD.native}
                        </FormHelperText>
                    </FormControl>
                </div>
                <div className="sound-container">
                    <div>
                        {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                            ? WORDS_CONFIG.GAME_SOUND.foreign
                            : WORDS_CONFIG.GAME_SOUND.native}
                    </div>
                    <div className="sound-controls">
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<VolumeMuteIcon />}
                            onClick={handleSoundOn}
                        >
                            on
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<VolumeOffIcon />}
                            onClick={handleSoundOff}
                        >
                            off
                        </Button>
                        <div className="volume-number">{gameSoundVolume}</div>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<VolumeDownIcon />}
                            onClick={handleSoundDown}
                        >
                            -
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<VolumeUpIcon />}
                            onClick={handleSoundUp}
                        >
                            +
                        </Button>
                    </div>
                </div>
                <div className="sound-container">
                    <div>
                        {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                            ? WORDS_CONFIG.GAME_MUSIC.foreign
                            : WORDS_CONFIG.GAME_MUSIC.native}
                    </div>
                    <div className="sound-controls">
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<VolumeMuteIcon />}
                            onClick={handleMusicOn}
                        >
                            on
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<VolumeOffIcon />}
                            onClick={handleMusicOff}
                        >
                            off
                        </Button>
                        <div className="volume-number">{gameMusicVolume}</div>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<VolumeDownIcon />}
                            onClick={handleMusicDown}
                        >
                            -
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<VolumeUpIcon />}
                            onClick={handleMusicUp}
                        >
                            +
                        </Button>
                    </div>
                </div>
                <div className="settings-field">
                    <FormControl variant="filled">
                        <InputLabel id="demo-simple-select-filled-label">
                            {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                ? WORDS_CONFIG.FIELD_LANGUAGE_NAME.foreign
                                : WORDS_CONFIG.FIELD_LANGUAGE_NAME.native}
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            name="gameLanguage"
                            value={gameLanguage || gameSettingsStore.gameSettings.gameLanguage}
                            onChange={handleLanguageChange}
                        >
                            <MenuItem value={'eng'}>
                                {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                    ? WORDS_CONFIG.FIELD_LANGUAGE_NAME_FOREIGN.foreign
                                    : WORDS_CONFIG.FIELD_LANGUAGE_NAME_FOREIGN.native}
                            </MenuItem>
                            <MenuItem value={'ru'}>
                                {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                    ? WORDS_CONFIG.FIELD_LANGUAGE_NAME_NATIVE.foreign
                                    : WORDS_CONFIG.FIELD_LANGUAGE_NAME_NATIVE.native}
                            </MenuItem>
                        </Select>
                        <FormHelperText>
                            {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                ? WORDS_CONFIG.FIELD_LANGUAGE_NAME_ADD.foreign
                                : WORDS_CONFIG.FIELD_LANGUAGE_NAME_ADD.native}
                        </FormHelperText>
                    </FormControl>
                </div>
                <div className="settings-nav">
                    <NavLink to="/main" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" color="primary" size="small" startIcon={<BackspaceIcon />}>
                            {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                                ? WORDS_CONFIG.BACK_BUTTON.foreign
                                : WORDS_CONFIG.BACK_BUTTON.native}
                        </Button>
                    </NavLink>
                    <Button variant="contained" color="primary" size="small" type="submit" startIcon={<SaveIcon />}>
                        {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                            ? WORDS_CONFIG.SAVE_BUTTON.foreign
                            : WORDS_CONFIG.SAVE_BUTTON.native}
                    </Button>
                </div>
            </form>
            {responseMessage}
        </div>
    );
});
