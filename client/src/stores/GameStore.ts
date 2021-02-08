import { generateCells } from './../utils/index';
import { Cell } from './../types/index';
import { action, observable } from 'mobx';
import { Face } from '../types';
import { N_OF_BOMBS } from '../constants';

export class GameStore {
    @observable
    isGameStarted = false;

    @action
    toggleIsGameStarted(): void {
        this.isGameStarted = !this.isGameStarted;
    }

    @action
    setIsGameStarted(value: boolean): void {
        this.isGameStarted = value;
    }

    @observable
    FaceButtonValue: Face = Face.smile;

    @action
    setFaceButtonValue(value: Face): void {
        this.FaceButtonValue = value;
    }

    @observable
    gameCells: Cell[][] = [];

    @action
    setCells(cells: Cell[][]): void {
        this.gameCells = cells;
    }

    @action
    setStartCells(width: number, height: number): void {
        this.gameCells = generateCells(width, height);
    }

    @observable
    bombCount: number = N_OF_BOMBS;

    @action
    incrementBombCounter(): void {
        this.bombCount++;
    }

    @action
    decrementBombCounter(): void {
        this.bombCount--;
    }

    @action
    setDefaultBombCount(): void {
        this.bombCount = N_OF_BOMBS;
    }

    @observable
    gameTime = 0;

    @action
    setGameTime(value: number): void {
        this.gameTime = value;
    }

    @observable
    isGameLost = false;

    @action
    setIsGameLost(value: boolean): void {
        this.isGameLost = value;
    }

    @observable
    isGameWon = false;

    @action
    setIsGameWon(value: boolean): void {
        this.isGameWon = value;
    }

    @action
    setDefaultStartGameValues(width: number, height: number): void {
        this.setStartCells(width, height);
        this.setIsGameLost(false);
        this.setIsGameWon(false);
        this.setDefaultBombCount();
        this.setIsGameStarted(false);
        //TODO
        this.setGameTime(0);
        this.setFaceButtonValue(Face.smile);
    }

    @action
    setGameLostValues(): void {
        this.setIsGameLost(true);
        // this.setFaceButtonValue(Face.loose);
        this.setIsGameStarted(false);
    }
    //TODO need it?
    @action
    setGameWinValues(): void {
        this.setIsGameLost(false);
        // this.setFaceButtonValue(Face.loose);
        this.setIsGameStarted(true);
    }

    @action
    setGameStartedValues(): void {
        this.setIsGameLost(false);
        this.setIsGameStarted(true);
    }
}
