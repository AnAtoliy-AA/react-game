import axios from 'axios';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@material-ui/core';
import BackspaceIcon from '@material-ui/icons/Backspace';
import { useStore } from '../../hooks/hooks';
import { GameStatistics } from '../../shared/interfaces';
import './GameStatistic.scss';

const PAGE_SIZE = 10;
const PAGES_PORTION = 3;

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
    const pagesCount = Math.ceil(gameStatisticsStore.gameStatistics.length / PAGE_SIZE);
    const pages = [];

    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [portionNumber, setPortionNumber] = useState(1);

    const portionCount = Math.ceil(pagesCount / PAGES_PORTION);
    const leftPortionPageNumber = (portionNumber - 1) * PAGES_PORTION + 1;
    const rightPortionPageNumber = portionNumber * PAGES_PORTION;

    const onPageChanged = (page: React.SetStateAction<number>): void => {
        setCurrentPage(page);
    };

    return (
        <div className="GameStatistic">
            GameStatistic Component
            <div className="pagination">
                <span>Page: </span>
                {portionNumber > 1 && <button onClick={() => setPortionNumber(portionNumber - 1)}>Previous</button>}
                {pages
                    .filter((p) => p >= leftPortionPageNumber && p <= rightPortionPageNumber)
                    .map((p) => {
                        return (
                            <span
                                key={p}
                                className={`${currentPage === p && 'selected-page'}`}
                                onClick={() => {
                                    onPageChanged(p);
                                }}
                            >
                                {p}
                            </span>
                        );
                    })}
                {portionCount > portionNumber && (
                    <button onClick={() => setPortionNumber(portionNumber + 1)}>Next</button>
                )}
            </div>
            {gameStatisticsStore.gameStatistics
                .slice((currentPage - 1) * PAGE_SIZE, PAGE_SIZE * currentPage)
                .map((el) => {
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
