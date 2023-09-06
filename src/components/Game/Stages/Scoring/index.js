import { updateDoc } from 'firebase/firestore';
import { LZString } from '../../../../lzstring.js';
import ScoringHeader from './ScoringHeader';
import './Scoring.css';

function Scoring({ game, user, gameRef }) {
    const albums = Object.values(game.albums).sort((a, b) => a.userId.localeCompare(b.userId));

    let currentAlbum;
    let previousTask;
    let currentTask;
    let round;
    
    for (const album of albums) {
        for (let i = 2; i <= albums.length; i++) {
            if (album.tasks[i].scores.length < albums.length - 1) {
                if (i === 2) {
                    previousTask = {
                        userId: album.userId,
                        username: album.username,
                        photoURL: album.photoURL,
                        content: album.prompt,
                        contentType: 'guess',
                    };
                }
                else {
                    previousTask = {
                        userId: album.tasks[i-1].userId,
                        username: album.tasks[i-1].username,
                        photoURL: album.tasks[i-1].photoURL,
                        content: album.tasks[i-1].content,
                        contentType: album.tasks[i-1].contentType
                    }
                };
                currentAlbum = album;
                currentTask = album.tasks[i];
                round = i;
                break;
            };
        };
        if (currentAlbum || previousTask || currentTask) {
            break;
        };
    };
    
    const hasScored = currentTask.scores.includes(user.uid);
    
    async function submitScore(score) {
        if (!hasScored) {
            return await updateDoc(gameRef, {
                [`albums.${currentAlbum.userId}.score`]: Number(currentAlbum.score) + Number(score),
                [`albums.${currentAlbum.userId}.tasks.${round}.scores`]: [...currentAlbum.tasks[round].scores, user.uid]
            });
        };
    };

    return (
        <div className='main scoring'>
            <ScoringHeader albums={albums} task={currentTask} />
            <div className='album-info'>
                <img alt='' src={currentAlbum.photoURL} />
                <div>
                    <p className='album-owner'>{currentAlbum.username}'s album:</p>
                    <p className='alubm-prompt'>{currentAlbum.prompt}</p>
                </div>
            </div>
            <div className={`previous-task ${previousTask.contentType}`}>
                <div className='task-header'>
                    <img alt='' src={previousTask.photoURL} />
                    <p>{previousTask.username}:</p>
                </div>
                <div className='task-body'>
                    {
                        previousTask.contentType === 'guess' ?
                        <p>{previousTask.content}</p> :
                        <img alt='' src={LZString.decompressFromBase64(previousTask.content)}/>
                    }
                </div>
            </div>
            <div className={`current-task ${currentTask.contentType}`}>
                <div className='task-header'>
                    <img alt='' src={currentTask.photoURL} />
                    <p>{currentTask.username}:</p>
                </div>
                <div className='task-body'>
                    {
                        currentTask.contentType === 'guess' ?
                        <p>{currentTask.content}</p> :
                        <img alt='' src={LZString.decompressFromBase64(currentTask.content)}/>
                    }
                </div>
            </div>
            <div className='score-section'>
                {
                    currentTask.userId === user.uid ?
                    <p>You can't vote for yourself!</p> :
                    <>
                        {
                            currentTask.contentType === 'guess' ?
                            <p>How reasonable is <strong>{currentTask.username.split(' ')[0]}</strong>'s guess based on <strong>{previousTask.username.split(' ')[0]}</strong>'s drawing?</p> :
                            <p>How well do you think <strong>{currentTask.username.split(' ')[0]}</strong>'s drawing represents <strong>{previousTask.username.split(' ')[0]}</strong>'s prompt?</p>
                        }
                        <div className='score-buttons'>
                            <button disabled={hasScored} onClick={() => submitScore(0)}>💩</button>
                            <button disabled={hasScored} onClick={() => submitScore(1)}>👍</button>
                            <button disabled={hasScored} onClick={() => submitScore(2)}>❤️‍🔥</button>
                        </div>
                    </>
                }
            </div>
        </div>
    );
};

export default Scoring;