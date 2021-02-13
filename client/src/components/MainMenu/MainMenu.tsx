import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './MainMenu.scss';
import { useTransition, animated, config } from 'react-spring';

const slides = [
    { id: 0, url: 'https://rusvesna.su/sites/default/files/styles/orign_wm/public/saper_vsu.jpg' },
    {
        id: 1,
        url:
            'https://lh3.googleusercontent.com/proxy/3Kif24CN3ql2HZLt-vOOBn4vhv9ETtkluXmnI6OAluJ2t38yBaafR1CE24atw0TT3IVlPHabB8izG8eU42AenYggPgdFeg8MnpWJxA',
    },
    { id: 2, url: 'https://oksait.ru/wp-content/uploads/2018/08/0101.jpg' },
    { id: 3, url: 'https://i1.wp.com/fb.ru/misc/i/gallery/27963/1235868.jpg' },
];
import { Spring } from 'react-spring/renderprops';

const MainMenu: React.FC = () => {
    const [index, set] = useState(0);
    const transitions = useTransition(slides[index], (item) => item.id, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: config.molasses,
    });
    useEffect(() => void setInterval(() => set((state) => (state + 1) % 4), 5000), []);
    return (
        <div className="main-menu">
            {transitions.map(({ item, props, key }) => (
                <animated.div
                    key={key}
                    className="bg"
                    style={{
                        ...props,
                        backgroundImage: `url(${item.url})`,
                    }}
                />
            ))}
            <Spring
                from={{ transform: 'translate3d(0,-20vh,0)' }}
                to={{ transform: 'translate3d(0,0vh,0)' }}
                config={{ duration: 1000 }}
            >
                {(props) => (
                    <div style={props}>
                        <div className="menu-container">
                            <NavLink to="/game" className="menu-nav">
                                START
                            </NavLink>
                        </div>
                    </div>
                )}
            </Spring>
            <Spring
                from={{ transform: 'translate3d(0,-40vh,0)' }}
                to={{ transform: 'translate3d(0,0vh,0)' }}
                config={{ duration: 1500 }}
            >
                {(props) => (
                    <div style={props}>
                        <div className="menu-container">
                            <NavLink to="/autoplay" className="menu-nav">
                                Autoplay
                            </NavLink>
                        </div>
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
                        <div className="menu-container">
                            <NavLink to="/settings" className="menu-nav">
                                Settings
                            </NavLink>
                        </div>
                    </div>
                )}
            </Spring>
            <Spring
                from={{ transform: 'translate3d(0,-80vh,0)' }}
                to={{ transform: 'translate3d(0,0vh,0)' }}
                config={{ duration: 2500 }}
            >
                {(props) => (
                    <div style={props}>
                        <div className="menu-container">
                            <NavLink to="/statistics" className="menu-nav">
                                Statistics
                            </NavLink>
                        </div>
                    </div>
                )}
            </Spring>
        </div>
    );
};

export default MainMenu;
