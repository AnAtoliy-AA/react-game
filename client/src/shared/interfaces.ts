export interface User {
    email: string;
    password: string;
}

export interface GameSettings {
    _id?: string;
    fieldWidth: number;
    fieldHeight: number;
    fieldStyle: string;
}
