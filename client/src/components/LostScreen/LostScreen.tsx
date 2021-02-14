import React from 'react';
import { Button } from '@material-ui/core';
import BackspaceIcon from '@material-ui/icons/Backspace';
import './LostScreen.scss';
import { useStore } from '../../hooks/hooks';
import { NavLink } from 'react-router-dom';
import { Spring } from 'react-spring/renderprops';

const LostScreen = () => {
    const gameStore = useStore('gameStore');
    const handleClick = () => {
        gameStore.setIsGameLost(false);
    };
    return (
        <div className="LostScreen">
            <Spring
                from={{ transform: 'translate3d(0,-40vh,0)' }}
                to={{ transform: 'translate3d(0,0vh,0)' }}
                config={{ duration: 2000 }}
            >
                {(props) => (
                    <div style={props}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={handleClick}
                            startIcon={<BackspaceIcon />}
                        >
                            Back to game
                        </Button>
                    </div>
                )}
            </Spring>
            <Spring
                from={{ transform: 'translate3d(0,-60vh,0)' }}
                to={{ transform: 'translate3d(0,0vh,0)' }}
                config={{ duration: 2000 }}
            >
                {(props) => (
                    <div style={props}>
                        <NavLink to="/main" style={{ textDecoration: 'none' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={handleClick}
                                startIcon={<BackspaceIcon />}
                            >
                                Main menu
                            </Button>
                        </NavLink>
                    </div>
                )}
            </Spring>
        </div>
    );
};

export default LostScreen;
