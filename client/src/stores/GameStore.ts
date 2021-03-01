import { generateCells } from './../utils/index';
import { Cell } from './../types/index';
import { action, observable } from 'mobx';
import { Face } from '../types';

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
    setStartCells(height: number, width: number, bombsQuantity: number): void {
        this.gameCells = generateCells(height, width, bombsQuantity);
    }

    @observable
    bombCount = 0;

    @action
    incrementBombCounter(): void {
        this.bombCount++;
    }

    @action
    decrementBombCounter(): void {
        this.bombCount--;
    }

    @action
    setBombCount(value: number): void {
        this.bombCount = value;
    }

    @observable
    gameTime = 0;

    @action
    setGameTime(value: number): void {
        this.gameTime = value;
    }

    @observable
    gameMoves = 0;

    @action
    setDefaultGameMoves(): void {
        this.gameMoves = 0;
    }

    @action
    incrementGameMoves(): void {
        this.gameMoves++;
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
    setDefaultStartGameValues(height: number, width: number, bombsQuantity: number): void {
        this.setStartCells(height, width, bombsQuantity);
        this.setIsGameLost(false);
        this.setIsGameWon(false);
        this.setBombCount(bombsQuantity);
        this.setIsGameStarted(false);
        //TODO
        this.setGameTime(0);
        this.setDefaultGameMoves();
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

    @observable
    activeCellRow = 0;

    @observable
    activeCellCol = 0;

    @action
    setActiveCellRow(value: number): void {
        this.activeCellRow = value;
    }

    @action
    setActiveCellCol(value: number): void {
        this.activeCellCol = value;
    }

    @action
    incrementActiveCellRow(): void {
        this.activeCellRow++;
    }

    @observable
    isAutoGameChanged = false;

    @action
    setIsAutoplayGameChanged(value: boolean): void {
        this.isAutoGameChanged = value;
    }
}
