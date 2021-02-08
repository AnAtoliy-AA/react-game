import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { Button, TextField } from '@material-ui/core';
import ExitToAppTwoToneIcon from '@material-ui/icons/ExitToAppTwoTone';

import './LoginForm.scss';
import { User } from '../../../shared/interfaces';
import { useStore } from '../../../hooks/hooks';

const LoginForm = observer(() => {
    const authStore = useStore('authStore');

    const sendRequest = async () => {
        console.log('sss');
    };

    const { register, handleSubmit, errors } = useForm<User>();
    const onSubmit = (data: User) => {
        axios
            .post('api/auth/login', {
                email: data.email,
                password: data.password,
            })
            .then((response: { data: { token: string } }) => {
                authStore.setToken(response.data.token);
                authStore.setIsAuth(true);
                sendRequest();
            });
    };
    return (
        <div>
            Login
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="field">
                    <TextField
                        id="name"
                        size="small"
                        name="email"
                        error={errors.email && true}
                        autoComplete="false"
                        label="Write your email here"
                        variant="outlined"
                        inputRef={register({ required: true })}
                    />
                    {errors.email && errors.email.type === 'required' && (
                        <div className="error">Your must enter email!.</div>
                    )}
                </div>
                <div className="field">
                    <TextField
                        id="password"
                        size="small"
                        name="password"
                        type="password"
                        error={errors.password && true}
                        autoComplete="false"
                        label="Write your password here"
                        variant="outlined"
                        inputRef={register({ required: true })}
                    />
                    {errors.password && errors.password.type === 'required' && (
                        <div className="error">Your must enter your password.</div>
                    )}
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    type="submit"
                    startIcon={<ExitToAppTwoToneIcon />}
                >
                    Login
                </Button>
            </form>
        </div>
    );
});

export default LoginForm;
