import React from 'react';
import GameBody from '../GameBody/GameBody';
import GameHeader from '../GameHeader/GameHeader';
import './App.scss';

const App: React.FC = () => {
    return (
        <div className="App">
            <GameHeader />
            <GameBody />
        </div>
    );
};

export default App;
