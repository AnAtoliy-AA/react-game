import { observer } from 'mobx-react-lite';
import React from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import { useStore } from '../../hooks/hooks';
import GameBody from '../GameBody/GameBody';
import GameHeader from '../GameHeader/GameHeader';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './App.scss';

const App: React.FC = () => {
    const gameStore = useStore('gameStore');
    const authStore = useStore('authStore');
    const handle = useFullScreenHandle();

    return (
        <div className="App">
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Header />
                <Route exact path="/login">
                    {/* {authStore.isAuth ? <Redirect to="/main" /> : <Login />} */}
                </Route>
                {/* <Route path="/register" component={Register} /> */}
                <Route exact path="/main">
                    {/* {!authStore.isAuth ? <Redirect to="/login" /> : <MainScreen />} */}
                </Route>
                <div className="GameContainer">
                    <button onClick={handle.enter}>Enter fullscreen</button>
                    <FullScreen handle={handle}>
                        <GameHeader />
                        <GameBody />
                    </FullScreen>
                </div>
                {gameStore.isGameLost && <div>LOST</div>}
                {gameStore.isGameWon && <div>WON</div>}
                <Footer />
            </BrowserRouter>
        </div>
    );
};

export default observer(App);
