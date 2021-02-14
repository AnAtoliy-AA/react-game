import { GameSettings } from '../shared/interfaces';
import { action, observable } from 'mobx';

const initialState = {
    fieldSize: '',
    fieldWidth: 9,
    fieldHeight: 9,
    bombsQuantity: 10,
    fieldStyle: '',
    gameSoundVolume: 1,
    gameMusicVolume: 1,
    gameLanguage: 'eng',
};
export class GameSettingsStore {
    @observable
    gameSettings: GameSettings = initialState;

    @action
    setGameSettings(gameSettings: GameSettings): void {
        this.gameSettings = gameSettings;
    }

    @observable
    lastGameSoundVolume = this.gameSettings.gameSoundVolume;

    @action
    turnSoundOn(): void {
        this.gameSettings.gameSoundVolume = this.lastGameSoundVolume;
    }

    @action
    turnSoundOff(): void {
        this.gameSettings.gameSoundVolume = 0;
    }

    @action
    incrementSoundVolume(): void {
        this.gameSettings.gameSoundVolume = +(this.gameSettings.gameSoundVolume + 0.1).toFixed(1);
        this.lastGameSoundVolume = this.gameSettings.gameSoundVolume;
    }

    @action
    decrementSoundVolume(): void {
        this.gameSettings.gameSoundVolume = +(this.gameSettings.gameSoundVolume - 0.1).toFixed(1);
        this.lastGameSoundVolume = this.gameSettings.gameSoundVolume;
    }
}
