import React from 'react';
import { NavLink } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import { useStore } from '../../hooks/hooks';
import './Header.scss';
import logo from '../../assets/images/mines_logo.bmp';

const Header: React.FC = () => {
    const authStore = useStore('authStore');
    return (
        <div className="header">
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
                        Login
                    </NavLink>
                    <NavLink to="/register" style={{ textDecoration: 'none' }}>
                        Register
                    </NavLink>
                </div>
            ) : (
                <NavLink to="/logout">Logout</NavLink>
            )}
        </div>
    );
};

export default Header;
