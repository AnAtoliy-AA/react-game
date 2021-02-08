import { GameSettings } from '../shared/interfaces';
import { action, observable } from 'mobx';

const initialState = {
    fieldWidth: 9,
    fieldHeight: 9,
    fieldStyle: '',
};
export class GameSettingsStore {
    @observable
    gameSettings: GameSettings = initialState;

    @action
    setGameSettings(gameSettings: GameSettings): void {
        this.gameSettings = gameSettings;
    }
}
