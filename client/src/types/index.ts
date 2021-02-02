export enum CellValue {
    empty,
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    bomb,
}

export enum CellState {
    default,
    visible,
    flagged,
}

export enum Face {
    smile = '😀',
    find = '😳',
    loose = '😖',
    win = '😎',
}

export type Cell = { value: CellValue; state: CellState; danger?: boolean };
