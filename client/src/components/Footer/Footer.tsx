import React from 'react';
import './Footer.scss';
import logo from '../../assets/images/logo.svg';

const Footer: React.FC = () => {
    return (
        <div className="Footer">
            <div className="AboutMe">
                <p>Create by:</p>
                <ul>
                    <li key="1">
                        <a href="https://github.com/AnAtoliyAK">AnAtoliyAK</a>
                    </li>
                </ul>
            </div>
            <div>2021</div>
            <div>
                <a href="https://rs.school/js/">
                    <img src={logo} className="FooterLogo" alt="logo" />
                </a>
            </div>
        </div>
    );
};

export default Footer;
