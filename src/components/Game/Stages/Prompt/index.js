import { useState } from 'react';
import { updateDoc } from 'firebase/firestore';
import { useTimer } from 'react-timer-hook';
import PromptHeader from './PromptHeader';
import './Prompt.css';

function Prompt({ game, user, gameRef }) {
    const [userPrompt, setUserPrompt] = useState('');
    const { seconds } = useTimer({ expiryTimestamp: game.expiryTimestamp, onExpire: submitPrompt });

    async function submitPrompt() {
        if ('prompt' in game.albums[user.uid] === false) {
            return await updateDoc(gameRef, {
                [`albums.${user.uid}.prompt`]: userPrompt
            });
        };
    };

    return (
        <div className='main prompt'>
            <PromptHeader game={game} seconds={seconds} />
            <div className='game-body'>
                <h2>Give your album a title:</h2>
                <p>Be creative. Write something you'd like to see others draw!</p>
                <input disabled={'prompt' in game.albums[user.uid]} value={'prompt' in game.albums[user.uid] ? game.albums[user.uid].prompt : userPrompt} className='guess-box' type='text' onChange={e => setUserPrompt(e.target.value)} />
                <button onClick={submitPrompt} disabled={'prompt' in game.albums[user.uid]}>Submit</button>
            </div>
        </div>
    );
};

export default Prompt;