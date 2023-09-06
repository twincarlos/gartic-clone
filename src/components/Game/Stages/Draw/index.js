import { useState, useRef } from 'react';
import { updateDoc } from 'firebase/firestore';
import { useTimer } from 'react-timer-hook';
import CanvasDraw from 'react-canvas-draw';
import { LZString } from '../../../../lzstring.js';
import DrawHeader from './DrawHeader';
import './Draw.css';

function Draw({ game, user, gameRef }) {
    const [brushRadius, setBrushRadius] = useState(5);
    const [brushColor, setBrushColor] = useState('pink');
    const canvasRef = useRef(null);

    const albums = Object.values(game.albums).sort((a, b) => a.userId.localeCompare(b.userId));
    const myIndex = albums.findIndex(album => album.userId === user.uid);
    const otherIndex = (myIndex + game.round - 1 < albums.length) ? (myIndex + game.round - 1) : ((myIndex + game.round - 1) - albums.length);
    const otherAlbum = albums[otherIndex];

    const { seconds } = useTimer({ expiryTimestamp: game.expiryTimestamp, onExpire: submitDrawing });

    const otherTask = (game.round === 2) ? ({
        userId: otherAlbum.userId,
        username: otherAlbum.username,
        photoURL: otherAlbum.photoURL,
        content: otherAlbum.prompt,
        contentType: 'guess'
    }) : otherAlbum.tasks[game.round - 1];

    const hasSubmitted = (otherAlbum.tasks && game.round in otherAlbum.tasks);

    async function submitDrawing() {
        if (!hasSubmitted) {
            const userDrawing = LZString.compressToBase64(canvasRef.current.getDataURL());
            return await updateDoc(gameRef, {
                [`albums.${otherAlbum.userId}.tasks.${game.round}`]: {
                    userId: user.uid,
                    username: user.displayName,
                    photoURL: user.photoURL,
                    content: userDrawing,
                    contentType: 'drawing',
                    scores: []
                }
            });
        };
    };

    return (
        <div className='main draw'>
            <DrawHeader game={game} albums={albums} seconds={seconds} />
            <div className='game-body'>
                <p>Draw this:</p>
                <h2>{otherTask.content}</h2>
                <div className='canvas'>
                    {
                        hasSubmitted ?
                            (
                                <img alt='' src={LZString.decompressFromBase64(otherAlbum.tasks[game.round].content)} />
                            ) :
                            (
                                <CanvasDraw
                                    lazyRadius={0}
                                    ref={canvasRef}
                                    brushRadius={brushRadius}
                                    brushColor={brushColor}
                                />
                            )
                    }
                    <div className='brush-settings'>
                        <div className='bubble-inputs'>
                            <button style={{ backgroundColor: brushColor, width: 5 }} onClick={() => setBrushRadius(5)} />
                            <button style={{ backgroundColor: brushColor, width: 20 }} onClick={() => setBrushRadius(10)} />
                            <button style={{ backgroundColor: brushColor, width: 25 }} onClick={() => setBrushRadius(15)} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <input className='color-input' style={{ zIndex: 1 }} type='color' onChange={e => setBrushColor(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button className='undo' onClick={() => canvasRef.current.undo()}><i className='fas fa-undo-alt' />Undo</button>
                            <button className='erase-all' onClick={() => canvasRef.current.eraseAll()}><i className='fas fa-trash-alt' />Erase all</button>
                        </div>
                    </div>
                </div>
                <button className='submit' onClick={submitDrawing} disabled={hasSubmitted}>Submit</button>
            </div>
        </div>
    );
};

export default Draw;