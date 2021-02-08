import React from 'react';
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SaveIcon from '@material-ui/icons/Save';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { User } from '../../shared/interfaces';
import './GameSettings.scss';
import { useStore } from '../../hooks/hooks';
import { DEFAULT_FIELD_SIZE } from '../../constants';

const GameSettings: React.FC = () => {
    return (
        <div className="GameSettings">
            <GameSettingsForm />
        </div>
    );
};

export default GameSettings;

export const GameSettingsForm = () => {
    const authStore = useStore('authStore');
    const gameSettingsStore = useStore('gameSettingsStore');
    const { handleSubmit } = useForm<User>();
    const onSubmit = () => {
        axios
            .patch(
                'api/settings',
                {
                    list: {
                        fieldSize: fieldSize || gameSettingsStore.gameSettings?.fieldSize,
                        fieldStyle: fieldStyle || gameSettingsStore.gameSettings?.fieldStyle,
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
                // mainScreenStore.toggleIsNewTaskFormOpen();
            });
    };

    const [fieldSize, setFieldSize] = React.useState('');
    const [fieldStyle, setFieldStyle] = React.useState('');

    const handleSizeChange = (event: any) => {
        setFieldSize(event.target.value);
    };
    const handleStyleChange = (event: any) => {
        setFieldStyle(event.target.value);
    };
    return (
        <div>
            Register
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="field">
                    <FormControl variant="filled">
                        <InputLabel id="demo-simple-select-filled-label">FieldSize</InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            name="fieldSize"
                            value={fieldSize || gameSettingsStore.gameSettings?.fieldSize}
                            onChange={handleSizeChange}
                        >
                            <MenuItem value={'Small'}>9x9</MenuItem>
                            <MenuItem value={'Normal'}>15x15</MenuItem>
                            <MenuItem value={'High'}>40X40</MenuItem>
                        </Select>
                        <FormHelperText>Select task priority</FormHelperText>
                    </FormControl>
                </div>
                <div className="field">
                    <FormControl variant="filled">
                        <InputLabel id="demo-simple-select-filled-label">Style</InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            name="fieldStyle"
                            value={fieldStyle || gameSettingsStore.gameSettings?.fieldStyle}
                            onChange={handleStyleChange}
                        >
                            <MenuItem value={'Classic'}>Classic</MenuItem>
                            <MenuItem value={'Custom'}>Custom</MenuItem>
                        </Select>
                        <FormHelperText>Select task priority</FormHelperText>
                    </FormControl>
                </div>
                <Button variant="contained" color="primary" size="small" startIcon={<BackspaceIcon />}>
                    Back
                </Button>
                <Button variant="contained" color="primary" size="small" type="submit" startIcon={<SaveIcon />}>
                    Save
                </Button>
            </form>
        </div>
    );
};
