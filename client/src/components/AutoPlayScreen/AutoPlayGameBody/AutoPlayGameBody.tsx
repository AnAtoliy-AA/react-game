import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../../hooks/hooks';
import CellButton from '../../CellButton/CellButton';
import './AutoPlayGameBody.scss';

import { Grid } from '@material-ui/core';

const AutoPlayGameBody: React.FC = () => {
    const gameStore = useStore('gameStore');

    const renderCells = (): React.ReactNode => {
        return gameStore.gameCells.map((row, rowIndex) => (
            <Grid container key={`${rowIndex}`} justify="center">
                {row.map((cell, colIndex) => (
                    <Grid item key={`cell-${rowIndex}${colIndex}`}>
                        <CellButton
                            state={cell.state}
                            value={cell.value}
                            danger={cell.danger}
                            checked={cell.checked}
                            active={cell.active}
                            row={rowIndex}
                            col={colIndex}
                        />
                    </Grid>
                ))}
            </Grid>
        ));
    };

    return (
        <Grid className="AutoPlayGameBody" container justify="center">
            {renderCells()}
        </Grid>
    );
};

export default observer(AutoPlayGameBody);
