import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../hooks/hooks';
import './Login.scss';
import LoginForm from './LoginForm/LoginForm';

const Login = observer(() => {
    const authStore = useStore('authStore');
    return <div className="Login">{!authStore.isAuth ? <LoginForm /> : 'you were logged in'}</div>;
});

export default Login;
