import React, { useState } from 'react';
import './Register.scss';
import { Button, TextField } from '@material-ui/core';
import ExitToAppTwoToneIcon from '@material-ui/icons/ExitToAppTwoTone';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { User } from '../../shared/interfaces';

const Register: React.FC = () => (
    <div className="register">
        <RegisterForm />
    </div>
);

export default Register;

export const RegisterForm = () => {
    const { register, handleSubmit, errors } = useForm<User>();
    const [responseMessage, setResponseMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = (data: User) => {
        axios
            .post('/api/auth/register', {
                email: data.email,
                password: data.password,
            })
            .then((response) => {
                setResponseMessage(response.statusText);
                console.log(response.statusText);
            })
            .catch((er) => {
                console.log('error: ', er.message);
                setErrorMessage(er.message);
            });
    };
    return (
        <div>
            Register
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
                    Register
                </Button>
            </form>
            <div className="response-message">{responseMessage}</div>
            <div className="error-message">{errorMessage}</div>
        </div>
    );
};
