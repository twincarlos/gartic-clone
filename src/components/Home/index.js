import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, doc, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import './Home.css';

function Home({ user }) {
    const [inputCode, setInputCode] = useState('');
    const [error, setError] = useState(null);
    const gamesRef = collection(db, 'games');
    const navigate = useNavigate();

    async function joinGame() {
        const gamesQuery = query(gamesRef, where('code', '==', Number(inputCode)));
        const gamesSnap = await getDocs(gamesQuery);
        if (!gamesSnap.empty) {
            const gameRef = doc(db, 'games', gamesSnap.docs[0].id);
            await updateDoc(gameRef, {
                [`albums.${user.uid}`]: {
                    userId: user.uid,
                    username: user.displayName,
                    photoURL: user.photoURL,
                    userIsHost: false,
                    score: 0
                }
            });
            return navigate(`/play/${gamesSnap.docs[0].id}`);
        };
        const gameDoc = gamesSnap.docs[0] && gamesSnap.docs[0].data();
        if (!gameDoc) {
            return setError('Game not found');
        };
        return setError('Cannot join game');
    };

    async function createGame() {
        const randomNumber = Math.floor(Math.random() * 9000) + 1000;
        const gameDoc = await addDoc(gamesRef, {
            code: randomNumber,
            stage: 'lobby',
            round: 0,
            albums: {
                [user.uid]: {
                    userId: user.uid,
                    username: user.displayName,
                    photoURL: user.photoURL,
                    userIsHost: true,
                    score: 0
                }
            }
        });
        return navigate(`/play/${gameDoc.id}`);
    };

    if (!user) {
        return <Navigate to='/login' />;
    };

    return (
        <div className='main home'>
            <h2>Welcome!</h2>
            <div className='user-info'>
                <img alt='' src={user.photoURL}/>
                <span>
                    <p>{user.displayName}</p>
                    <button onClick={() => auth.signOut()}>Logout</button>
                </span>
            </div>
            <div className='join-section'>
                <p>Join an existing game:</p>
                <input placeholder='Enter code' maxLength={4} type='text' onChange={e => setInputCode(e.target.value)} />
                <button onClick={joinGame}>Join</button>
                <p style={{ color: 'var(--bright-pink)' }}>{error}</p>
            </div>
            <div className='host-section'>
                <p>Host a game:</p>
                <button onClick={createGame}>Host</button>
            </div>
        </div>
    );
};

export default Home;