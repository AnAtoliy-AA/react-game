export interface User {
    email: string;
    password: string;
}

export interface GameSettings {
    _id?: string;
    fieldSize: string;
    fieldWidth: number;
    fieldHeight: number;
    bombsQuantity: number;
    fieldStyle: string;
}

export interface GameStatistics {
    _id?: string;
    level: string;
    statusWin: boolean;
    statusLost: boolean;
    gameMoves: number;
    time: number;
}
