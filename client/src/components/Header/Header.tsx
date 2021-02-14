import React from 'react';
import { NavLink } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import { useStore } from '../../hooks/hooks';
import './Header.scss';
import logo from '../../assets/images/mines_logo.bmp';
import { observer } from 'mobx-react-lite';
import { Button } from '@material-ui/core';
import ExitToAppTwoToneIcon from '@material-ui/icons/ExitToAppTwoTone';

const Header: React.FC = () => {
    const authStore = useStore('authStore');
    const gameSettingsStore = useStore('gameSettingsStore');

    const logOut = () => authStore.setIsAuth(false);

    return (
        <div className={`header ${gameSettingsStore.gameSettings.fieldStyle === 'Custom' ? 'custom' : ''}`}>
            <div>
                <NavLink to="/main">
                    <img className="logo" src={logo} alt="Minesweeper" />
                </NavLink>
            </div>
            {authStore.isAuth ? (
                <Alert severity="success">You were authorized</Alert>
            ) : (
                <Alert severity="error">Please login or register!</Alert>
            )}
            {!authStore.isAuth ? (
                <div className="header-nav">
                    <NavLink to="/login" style={{ textDecoration: 'none' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            type="submit"
                            startIcon={<ExitToAppTwoToneIcon />}
                        >
                            Login
                        </Button>
                    </NavLink>
                    <NavLink to="/register" style={{ textDecoration: 'none' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            type="submit"
                            startIcon={<ExitToAppTwoToneIcon />}
                        >
                            Register
                        </Button>
                    </NavLink>
                </div>
            ) : (
                <div className="header-nav">
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        type="submit"
                        onClick={logOut}
                        startIcon={<ExitToAppTwoToneIcon />}
                    >
                        Logout
                    </Button>
                </div>
            )}
        </div>
    );
};

export default observer(Header);
