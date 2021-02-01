import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../hooks/hooks';
import './FaceButton.scss';

const FaceButton: React.FC = observer(() => {
    const gameStore = useStore('gameStore');

    return <div className="FaceButton">{gameStore.FaceButtonValue}</div>;
});

export default FaceButton;
