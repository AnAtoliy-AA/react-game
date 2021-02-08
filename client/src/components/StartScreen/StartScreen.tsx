import React from 'react';
import { NavLink } from 'react-router-dom';
import './StartScreen.scss';

const StartScreen: React.FC = () => {
    return (
        <div className="StartScreen">
            <NavLink to="/main">Start</NavLink>
            <NavLink to="/settings">Settings</NavLink>
        </div>
    );
};

export default StartScreen;
