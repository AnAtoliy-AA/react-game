import React from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';

import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/hooks';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Login from '../Login/Login';
import Register from '../Register/Register';
import GameSettings from '../GameSettings/GameSettings';
import LostScreen from '../LostScreen/LostScreen';
import WinScreen from '../WinScreen/WinScreen';
import MainMenu from '../MainMenu/MainMenu';
import GameScreen from '../GameScreen/GameScreen';
import GameStatistic from '../GameStatistic/GameStatistic';
import AutoPlayScreen from '../AutoPlayScreen/AutoPlayScreen';
import './App.scss';

const App: React.FC = () => {
    const gameStore = useStore('gameStore');
    const authStore = useStore('authStore');

    return (
        <div className="App">
            <div className="app-wrapper">
                <BrowserRouter basename={process.env.PUBLIC_URL}>
                    <Header />
                    <Route exact path="/">
                        <span className="text">minesweeper</span>
                    </Route>
                    <Route exact path="/main">
                        {!authStore.isAuth ? <Redirect to="/login" /> : <MainMenu />}
                    </Route>
                    <Route exact path="/login">
                        {authStore.isAuth ? <Redirect to="/main" /> : <Login />}
                    </Route>
                    <Route path="/register" component={Register} />
                    <Route exact path="/game">
                        {!authStore.isAuth ? <Redirect to="/login" /> : <GameScreen />}
                        {gameStore.isGameLost && <Redirect to="/lost" />}
                        {gameStore.isGameWon && <Redirect to="/win" />}
                    </Route>
                    <Route exact path="/win">
                        {!authStore.isAuth ? <Redirect to="/login" /> : <WinScreen />}
                        {!gameStore.isGameWon && <Redirect to="/game" />}
                    </Route>
                    <Route exact path="/lost">
                        {!authStore.isAuth ? <Redirect to="/login" /> : <LostScreen />}
                        {!gameStore.isGameLost && <Redirect to="/game" />}
                    </Route>
                    <Route exact path="/autoplay">
                        {!authStore.isAuth ? <Redirect to="/login" /> : <AutoPlayScreen />}
                        {gameStore.isGameLost && <Redirect to="/lost" />}
                        {gameStore.isGameWon && <Redirect to="/win" />}
                    </Route>
                    <Route exact path="/settings">
                        {!authStore.isAuth ? <Redirect to="/login" /> : <GameSettings />}
                    </Route>
                    <Route exact path="/statistics">
                        {!authStore.isAuth ? <Redirect to="/login" /> : <GameStatistic />}
                    </Route>
                    <Footer />
                </BrowserRouter>
            </div>
        </div>
    );
};

export default observer(App);
