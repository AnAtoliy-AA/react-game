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
import { DEFAULT_FOREIGN_LANGUAGE, WORDS_CONFIG } from '../../constants';
import moment from 'moment';
import './GameStatistic.scss';

const PAGE_SIZE = 10;
const PAGES_PORTION = 3;

const GameStatistic: React.FC = () => {
    const authStore = useStore('authStore');
    const gameSettingsStore = useStore('gameSettingsStore');
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
            {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                ? WORDS_CONFIG.STATISTICS_BUTTON.foreign
                : WORDS_CONFIG.STATISTICS_BUTTON.native}
            <div className="pagination">
                {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                    ? WORDS_CONFIG.PAGE_FIELD.foreign
                    : WORDS_CONFIG.PAGE_FIELD.native}
                {portionNumber > 1 && (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => setPortionNumber(portionNumber - 1)}
                        startIcon={<ArrowBackIcon />}
                    >
                        {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                            ? WORDS_CONFIG.PREVIOUS_BUTTON.foreign
                            : WORDS_CONFIG.PREVIOUS_BUTTON.native}
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
                        {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                            ? WORDS_CONFIG.NEXT_BUTTON.foreign
                            : WORDS_CONFIG.NEXT_BUTTON.native}
                    </Button>
                )}
            </div>
            <div className="statistics-card">
                <div>
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.LEVEL_FIELD.foreign
                        : WORDS_CONFIG.LEVEL_FIELD.native}
                </div>
                <div>
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.FINISHED_FIELD.foreign
                        : WORDS_CONFIG.FINISHED_FIELD.native}
                </div>
                <div>
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.MOVES_FIELD.foreign
                        : WORDS_CONFIG.MOVES_FIELD.native}
                </div>
                <div>
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.TIME_FIELD.foreign
                        : WORDS_CONFIG.TIME_FIELD.native}
                </div>
                <div className="card-date">
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.DATE_FIELD.foreign
                        : WORDS_CONFIG.DATE_FIELD.native}
                </div>
            </div>
            {gameStatisticsStore.gameStatistics
                .slice((currentPage - 1) * PAGE_SIZE, PAGE_SIZE * currentPage)
                .map((el) => {
                    return (
                        <div className="statistics-card" key={el._id}>
                            <div>{el.level}</div>
                            {el.statusWin === 'true' && <div>🥳</div>}
                            {el.statusLost === 'true' && <div>😭</div>}
                            <div>{el.gameMoves}</div>
                            <div>{el.time}</div>
                            <div>{moment(el.date).format('DD MM yyyy HH:mm')}</div>
                        </div>
                    );
                })}
            <div className="statistics-controls">
                <NavLink to="/main" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary" size="small" startIcon={<BackspaceIcon />}>
                        {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                            ? WORDS_CONFIG.BACK_BUTTON.foreign
                            : WORDS_CONFIG.BACK_BUTTON.native}
                    </Button>
                </NavLink>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={getStatistics}
                    startIcon={<ThreeSixtyIcon />}
                >
                    {gameSettingsStore.gameSettings.gameLanguage === DEFAULT_FOREIGN_LANGUAGE
                        ? WORDS_CONFIG.REFRESH_BUTTON.foreign
                        : WORDS_CONFIG.REFRESH_BUTTON.native}
                </Button>
            </div>
        </div>
    );
};

export default observer(GameStatistic);
