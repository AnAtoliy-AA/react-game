import axios from 'axios';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@material-ui/core';
import BackspaceIcon from '@material-ui/icons/Backspace';
import { useStore } from '../../hooks/hooks';
import { GameStatistics } from '../../shared/interfaces';
import './GameStatistic.scss';

const GameStatistic: React.FC = () => {
    const authStore = useStore('authStore');
    const gameStatisticsStore = useStore('gameStatisticsStore');

    const getStattistics = async () => {
        axios
            .get('/api/statistics', {
                headers: {
                    authorization: authStore.token,
                },
            })
            .then((response) => {
                const responseStatistics = response.data.map((el: { list: GameStatistics[] }) => el.list[0]);
                gameStatisticsStore.setGameStatistics(responseStatistics);
            });
    };
    //TODO
    return (
        <div className="GameStatistic">
            GameStatistic Component
            {gameStatisticsStore.gameStatistics.map((el) => {
                return (
                    <div className="statisitcs-card" key={el._id}>
                        <div>Level: {el.level}</div>
                        {!!el.statusWin ? <div>Win</div> : 'null'}
                        {!!el.statusLost && <div>Lost </div>}
                        <div>Moves: {el.gameMoves}</div>
                        <div>Time: {el.time}</div>
                    </div>
                );
            })}
            <div className="statisics-controls">
                <NavLink to="/main" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary" size="small" startIcon={<BackspaceIcon />}>
                        Back
                    </Button>
                </NavLink>
                <button onClick={getStattistics}>refresh</button>
            </div>
        </div>
    );
};

export default observer(GameStatistic);
