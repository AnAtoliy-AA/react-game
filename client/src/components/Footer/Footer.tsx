import React from 'react';
import './Footer.scss';
import logo from '../../assets/images/rs_logo.svg';
import gitLogo from '../../assets/images/github_logo.bmp';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/hooks';

const Footer: React.FC = () => {
    const gameSettingsStore = useStore('gameSettingsStore');
    return (
        <div className={`footer ${gameSettingsStore.gameSettings.fieldStyle === 'Custom' ? 'custom' : ''}`}>
            <div className="about-me">
                <a href="https://github.com/AnAtoliyAK">
                    <img src={gitLogo} className="footer-logo" alt="rs_logo" />
                    <span>AnAtoliyAA</span>
                </a>
            </div>
            <div>2021</div>
            <div>
                <a href="https://rs.school/js/">
                    <img src={logo} className="footer-logo" alt="rs_logo" />
                </a>
            </div>
        </div>
    );
};

export default observer(Footer);
