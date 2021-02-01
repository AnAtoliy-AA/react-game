import { action, observable } from 'mobx';
import { Face } from '../types';

export class GameStore {
    @observable
    isGameStarted = false;

    @action
    toggleIsGameStarted(): void {
        this.isGameStarted = !this.isGameStarted;
    }

    @observable
    FaceButtonValue: Face = Face.smile;

    @action
    setFaceButtonValue(value: Face) {
        this.FaceButtonValue = value;
    }

    @observable
    isCellClicked = false;

    @action
    toggleIsCellClicked(): void {
        this.isCellClicked = !this.isCellClicked;
    }
}
