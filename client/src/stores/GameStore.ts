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
    isCellClicked = false;

    @action
    toggleIsCellClicked(): void {
        this.isCellClicked = !this.isCellClicked;
    }
}
