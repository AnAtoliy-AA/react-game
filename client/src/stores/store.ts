import React from 'react';
import { GameStore } from './GameStore';
export const stores = Object.freeze({
    gameStore: new GameStore(),
});

export const storesContext = React.createContext(stores);
export const StoresProvider = storesContext.Provider;
