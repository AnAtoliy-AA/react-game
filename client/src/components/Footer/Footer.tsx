import React from 'react';
import './Footer.scss';
import logo from '../../assets/images/rs_logo.svg';
import gitLogo from '../../assets/images/github_logo.bmp';

const Footer: React.FC = () => {
    return (
        <div className="footer">
            <div className="about-me">
                <a href="https://github.com/AnAtoliyAK">
                    <img src={gitLogo} className="footer-logo" alt="rs_logo" />
                    AnAtoliyAA
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

export default Footer;
