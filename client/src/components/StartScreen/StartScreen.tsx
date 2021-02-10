import React from 'react';
import { NavLink } from 'react-router-dom';
import './StartScreen.scss';

const StartScreen: React.FC = () => {
    return (
        <div className="start-screen">
            <NavLink to="/main" style={{ textDecoration: 'none' }}>
                Start
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

export default StartScreen;
