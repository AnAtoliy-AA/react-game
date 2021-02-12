import React from 'react';
import { NavLink } from 'react-router-dom';
import './MainMenu.scss';

const MainMenu: React.FC = () => {
    return (
        <div className="main-menu">
            <NavLink to="/game" style={{ textDecoration: 'none' }}>
                Start
            </NavLink>
            <NavLink to="/autoplay" style={{ textDecoration: 'none' }}>
                Autoplay
            </NavLink>
            <NavLink to="/settings" style={{ textDecoration: 'none' }}>
                Settings
            </NavLink>
            <NavLink to="/statistics" style={{ textDecoration: 'none' }}>
                Statistics
            </NavLink>
        </div>
    );
};

export default MainMenu;
