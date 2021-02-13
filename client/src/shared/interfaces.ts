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
    gameSoundVolume: number;
}

export interface GameStatistics {
    _id?: string;
    level: string;
    statusWin: string;
    statusLost: string;
    gameMoves: number;
    time: number;
    date: Date;
}
