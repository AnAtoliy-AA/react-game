import React from 'react';
import { AuthStore } from './AuthStore';
import { GameStore } from './GameStore';
export const stores = Object.freeze({
    gameStore: new GameStore(),
    authStore: new AuthStore(),
});

export const storesContext = React.createContext(stores);
export const StoresProvider = storesContext.Provider;
