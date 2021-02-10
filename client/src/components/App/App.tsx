import { observer } from 'mobx-react-lite';
import React from 'react';

import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import { useStore } from '../../hooks/hooks';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './App.scss';
import MainScreen from '../MainScreen/MainScreen';
import StartScreen from '../StartScreen/StartScreen';
import Login from '../Login/Login';
import Register from '../Register/Register';
import GameSettings from '../GameSettings/GameSettings';

const App: React.FC = () => {
    const gameStore = useStore('gameStore');
    const authStore = useStore('authStore');

    return (
        <div className="App">
            <div className="app-wrapper">
                <BrowserRouter basename={process.env.PUBLIC_URL}>
                    <Header />
                    <Route exact path="/start">
                        {!authStore.isAuth ? <Redirect to="/login" /> : <StartScreen />}
                    </Route>
                    <Route exact path="/login">
                        {authStore.isAuth ? <Redirect to="/start" /> : <Login />}
                    </Route>
                    <Route path="/register" component={Register} />
                    <Route exact path="/main">
                        {!authStore.isAuth ? <Redirect to="/login" /> : <MainScreen />}
                    </Route>
                    <Route exact path="/settings">
                        {!authStore.isAuth ? <Redirect to="/main" /> : <GameSettings />}
                    </Route>
                    {gameStore.isGameLost && <div>LOST</div>}
                    {gameStore.isGameWon && <div>WON</div>}
                    <Footer />
                </BrowserRouter>
            </div>
        </div>
    );
};

export default observer(App);
