import { GameStatistics } from './../shared/interfaces';
import { action, observable } from 'mobx';

export class GameStatisticsStore {
    @observable
    gameStatistics: GameStatistics[] = [];

    @action
    setGameStatistics(value: GameStatistics[]): void {
        this.gameStatistics = value;
    }
}
