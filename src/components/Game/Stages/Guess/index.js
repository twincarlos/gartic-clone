import { useState } from 'react';
import { updateDoc } from 'firebase/firestore';
import { LZString } from '../../../../lzstring.js';
import { useTimer } from 'react-timer-hook';
import GuessHeader from './GuessHeader';
import './Guess.css';

function Guess({ game, user, gameRef }) {
    const [userGuess, setUserGuess] = useState('');
    const albums = Object.values(game.albums).sort((a, b) => a.userId.localeCompare(b.userId));
    const myIndex = albums.findIndex(album => album.userId === user.uid);
    const otherIndex = (myIndex + game.round - 1 < albums.length) ? (myIndex + game.round - 1) : ((myIndex + game.round - 1) - albums.length);
    const otherAlbum = albums[otherIndex];
    const otherTask = otherAlbum.tasks[game.round - 1];
    const { seconds } = useTimer({ expiryTimestamp: game.expiryTimestamp, onExpire: submitGuess });

    async function submitGuess() {
        if (game.round in otherAlbum.tasks === false) {
            return await updateDoc(gameRef, {
                [`albums.${otherAlbum.userId}.tasks.${game.round}`]: {
                    userId: user.uid,
                    username: user.displayName,
                    photoURL: user.photoURL,
                    content: userGuess,
                    contentType: 'guess',
                    scores: []
                }
            });
        };
    };

    return (
        <div className='main guess'>
            <GuessHeader game={game} albums={albums} seconds={seconds} />
            <div className='game-body'>
                <p>Can you guess what this is?</p>
                <img alt='' src={LZString.decompressFromBase64(otherTask.content)} />
                <input value={userGuess} type='text' onChange={e => setUserGuess(e.target.value)} />
                <button className='submit' onClick={submitGuess} disabled={game.round in otherAlbum.tasks}>Submit</button>
            </div>
        </div>
    );
};

export default Guess;