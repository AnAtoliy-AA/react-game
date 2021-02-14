import axios from 'axios';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@material-ui/core';
import BackspaceIcon from '@material-ui/icons/Backspace';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useStore } from '../../hooks/hooks';
import { GameStatistics } from '../../shared/interfaces';
import moment from 'moment';
import './GameStatistic.scss';

const PAGE_SIZE = 10;
const PAGES_PORTION = 3;

const GameStatistic: React.FC = () => {
    const authStore = useStore('authStore');
    const gameStatisticsStore = useStore('gameStatisticsStore');

    const getStatistics = async () => {
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
                {portionNumber > 1 && (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => setPortionNumber(portionNumber - 1)}
                        startIcon={<ArrowBackIcon />}
                    >
                        Previous
                    </Button>
                )}
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
                <span> of {pagesCount}</span>
                {portionCount > portionNumber && (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => setPortionNumber(portionNumber + 1)}
                        startIcon={<ArrowForwardIcon />}
                    >
                        Next
                    </Button>
                )}
            </div>
            <div className="statistics-card">
                <div>Level</div>
                <div>Finished</div>
                <div>Moves</div>
                <div>Time</div>
                <div className="card-date">Date</div>
            </div>
            {gameStatisticsStore.gameStatistics
                .slice((currentPage - 1) * PAGE_SIZE, PAGE_SIZE * currentPage)
                .map((el) => {
                    return (
                        <div className="statistics-card" key={el._id}>
                            <div>{el.level}</div>
                            {el.statusWin === 'true' && <div>Win</div>}
                            {el.statusLost === 'true' && <div>Lost </div>}
                            <div>{el.gameMoves}</div>
                            <div>{el.time}</div>
                            <div>{moment(el.date).format('DD MMM yyyy HH:mm')}</div>
                        </div>
                    );
                })}
            <div className="statistics-controls">
                <NavLink to="/main" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary" size="small" startIcon={<BackspaceIcon />}>
                        Back
                    </Button>
                </NavLink>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={getStatistics}
                    startIcon={<ThreeSixtyIcon />}
                >
                    Refresh
                </Button>
            </div>
        </div>
    );
};

export default observer(GameStatistic);
