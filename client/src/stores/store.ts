import { GameStatisticsStore } from './GameStatistics';
import React from 'react';
import { GameSettingsStore } from './GameSettingsStore';
import { AuthStore } from './AuthStore';
import { GameStore } from './GameStore';
export const stores = Object.freeze({
    gameStore: new GameStore(),
    authStore: new AuthStore(),
    gameSettingsStore: new GameSettingsStore(),
    gameStatisticsStore: new GameStatisticsStore(),
});

export const storesContext = React.createContext(stores);
export const StoresProvider = storesContext.Provider;
