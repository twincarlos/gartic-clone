import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../../firebase';
import Lobby from '../Game/Stages/Lobby';
import Prompt from '../Game/Stages/Prompt';
import Draw from '../Game/Stages/Draw';
import Guess from '../Game/Stages/Guess';
import Scoring from '../Game/Stages/Scoring';
import Results from '../Game/Stages/Results';
import Login from '../Login';
import Home from '../Home';
import './Game.css';

function Game({ user }) {
    const gameId = useParams().gameId;
    const gameRef = doc(db, 'games', gameId);
    const [game, setGame] = useState(null);

    async function gameLogic() {
        onSnapshot(gameRef, async snapshot => {
            const doc = snapshot.data();
            const albums = Object.values(doc.albums).sort((a, b) => a.userId.localeCompare(b.userId));
    
            if (doc.stage === 'prompt') {
                for (const album of albums) {
                    if ('prompt' in album === false) {
                        return setGame(doc);
                    };
                };
                if (doc.round === albums.length) {
                    return await updateDoc(gameRef, {
                        stage: 'scoring',
                        round: deleteField(),
                        expiryTimestamp: deleteField()
                    });
                };
                const date = new Date();
                const expiryTimestamp = date.setSeconds(date.getSeconds() + 60);
                return await updateDoc(gameRef, {
                    stage: 'draw',
                    round: doc.round + 1,
                    expiryTimestamp
                });
            };
    
            if (doc.stage === 'draw') {
                for (const album of albums) {
                    if (!album.tasks || doc.round in album.tasks === false) {
                        return setGame(doc);
                    };
                };
                if (doc.round === albums.length) {
                    return await updateDoc(gameRef, {
                        stage: 'scoring',
                        round: deleteField(),
                        expiryTimestamp: deleteField()
                    });
                };
                const date = new Date();
                const expiryTimestamp = date.setSeconds(date.getSeconds() + 30);
                return await updateDoc(gameRef, {
                    stage: 'guess',
                    round: doc.round + 1,
                    expiryTimestamp
                });
            };
    
            if (doc.stage === 'guess') {
                for (const album of albums) {
                    if (doc.round in album.tasks === false) {
                        return setGame(doc);
                    };
                };
                if (doc.round === albums.length) {
                    return await updateDoc(gameRef, {
                        stage: 'scoring',
                        round: deleteField(),
                        expiryTimestamp: deleteField()
                    });
                };
                const date = new Date();
                const expiryTimestamp = date.setSeconds(date.getSeconds() + 60);
                return await updateDoc(gameRef, {
                    stage: 'draw',
                    round: doc.round + 1,
                    expiryTimestamp
                });
            };
    
            if (doc.stage === 'scoring') {
                for (const album of albums) {
                    const tasks = Object.values(album.tasks).sort((a, b) => a.round - b.round);
                    for (const task of tasks) {
                        if (task.scores.length < albums.length - 1) {
                            return setGame(doc);
                        };
                    };
                };
                return await updateDoc(gameRef, {
                    stage: 'results',
                });
            };
    
            return setGame(doc);
        });
    };


    useEffect(() => {
        (async function () {
            await gameLogic();
        })();
    }, []);

    if (!user) {
        return <Login user={user} />;
    };

    if (!game || game.stage === 'over') {
        return <Home user={user} />;
    };

    const stages = {
        'lobby': <Lobby game={game} user={user} gameRef={gameRef} />,
        'prompt': <Prompt game={game} user={user} gameRef={gameRef} />,
        'draw': <Draw game={game} user={user} gameRef={gameRef} />,
        'guess': <Guess game={game} user={user} gameRef={gameRef} />,
        'scoring': <Scoring game={game} user={user} gameRef={gameRef} />,
        'results': <Results game={game} user={user} gameRef={gameRef} />
    };

    return stages[game.stage];
};

export default Game;