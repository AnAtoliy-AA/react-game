import { observer } from 'mobx-react-lite';
import React from 'react';

import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import { useStore } from '../../hooks/hooks';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './App.scss';
import MainScreen from '../GameScreen/GameScreen';
import StartScreen from '../MainMenu/MainMenu';
import Login from '../Login/Login';
import Register from '../Register/Register';
import GameSettings from '../GameSettings/GameSettings';
import LostScreen from '../LostScreen/LostScreen';
import WinScreen from '../WinScreen/WinScreen';
import MainMenu from '../MainMenu/MainMenu';
import GameScreen from '../GameScreen/GameScreen';

const App: React.FC = () => {
    const gameStore = useStore('gameStore');
    const authStore = useStore('authStore');

    return (
        <div className="App">
            <div className="app-wrapper">
                <BrowserRouter basename={process.env.PUBLIC_URL}>
                    <Header />
                    <Route exact path="/main">
                        {!authStore.isAuth ? <Redirect to="/login" /> : <MainMenu />}
                    </Route>
                    <Route exact path="/login">
                        {authStore.isAuth ? <Redirect to="/main" /> : <Login />}
                    </Route>
                    <Route path="/register" component={Register} />
                    <Route exact path="/game">
                        {!authStore.isAuth ? <Redirect to="/login" /> : <GameScreen />}
                    </Route>
                    <Route exact path="/settings">
                        {!authStore.isAuth ? <Redirect to="/login" /> : <GameSettings />}
                    </Route>
                    {gameStore.isGameLost && <LostScreen />}
                    {gameStore.isGameWon && <WinScreen />}
                    <Footer />
                </BrowserRouter>
            </div>
        </div>
    );
};

export default observer(App);
