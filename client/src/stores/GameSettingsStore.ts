import { GameSettings } from '../shared/interfaces';
import { action, observable } from 'mobx';

export class GameSettingsStore {
    @observable
    gameSettings: GameSettings | undefined;

    @action
    setGameSettings(gameSettings: GameSettings): void {
        this.gameSettings = gameSettings;
    }
}
