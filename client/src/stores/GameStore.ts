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
    gameCells: Cell[][] = generateCells();

    @action
    setCells(cells: Cell[][]): void {
        this.gameCells = cells;
    }

    @action
    setStartCells(): void {
        this.gameCells = generateCells();
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
}
