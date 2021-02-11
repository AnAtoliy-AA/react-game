import React from 'react';
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SaveIcon from '@material-ui/icons/Save';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './GameSettings.scss';
import { useStore } from '../../hooks/hooks';
import { FIELD_SIZES } from '../../constants';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

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
    const [fieldWidth, setFieldWidth] = React.useState(0);
    const [fieldHeight, setFieldHeight] = React.useState(0);
    const [bombsQuantity, setBombsQuantity] = React.useState(0);
    const [fieldStyle, setFieldStyle] = React.useState(gameSettingsStore.gameSettings.fieldStyle);
    //TODO
    const [gameSoundVolume, setGameSoundVolume] = React.useState(gameSettingsStore.gameSettings.gameSoundVolume);

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
                        gameSoundVolume: gameSettingsStore.gameSettings.gameSoundVolume,
                    },
                },
                {
                    headers: {
                        authorization: authStore.token,
                    },
                },
            )
            .then((response) => {
                // sendRequest();
                gameSettingsStore.setGameSettings(response.data.list[0]);
                gameStore.setDefaultStartGameValues(
                    gameSettingsStore.gameSettings.fieldHeight,
                    gameSettingsStore.gameSettings.fieldWidth,
                    gameSettingsStore.gameSettings.bombsQuantity,
                );
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

    const handleSoundOn = () => {
        gameSettingsStore.turnSoundOn();
    };

    const handleSoundOff = () => {
        gameSettingsStore.turnSoundOff();
    };

    const handleSoundUp = () => {
        gameSettingsStore.incrementSoundVolume();
    };

    const handleSoundDown = () => {
        gameSettingsStore.decrementSoundVolume();
    };
    return (
        <div>
            Settings
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="field">
                    <FormControl variant="filled">
                        <InputLabel id="demo-simple-select-filled-label">FieldSize</InputLabel>
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
                        <FormHelperText>Select field size</FormHelperText>
                    </FormControl>
                </div>
                <div className="field">
                    <FormControl variant="filled">
                        <InputLabel id="demo-simple-select-filled-label">Style</InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            name="fieldStyle"
                            value={fieldStyle || gameSettingsStore.gameSettings.fieldStyle}
                            onChange={handleStyleChange}
                        >
                            <MenuItem value={'Classic'}>Classic</MenuItem>
                            <MenuItem value={'Custom'}>Custom</MenuItem>
                        </Select>
                        <FormHelperText>Select field style</FormHelperText>
                    </FormControl>
                </div>
                <div>
                    TODO
                    {gameSettingsStore.gameSettings.gameSoundVolume}
                    <button onClick={handleSoundOn}>on</button>
                    <button onClick={handleSoundOff}>off</button>
                    <button onClick={handleSoundUp}>+</button>
                    <button onClick={handleSoundDown}>-</button>
                </div>
                <div>Language</div>
                <NavLink to="/main" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary" size="small" startIcon={<BackspaceIcon />}>
                        Back
                    </Button>
                </NavLink>
                <Button variant="contained" color="primary" size="small" type="submit" startIcon={<SaveIcon />}>
                    Save
                </Button>
            </form>
        </div>
    );
});
