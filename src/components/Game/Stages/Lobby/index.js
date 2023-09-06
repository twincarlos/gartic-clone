import { deleteField, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import './Lobby.css';

function Lobby({ game, user, gameRef }) {
    const albums = Object.values(game.albums).sort((a, b) => a.userId.localeCompare(b.userId));
    const hostUser = albums.find(album => album.userIsHost === true);
    const navigate = useNavigate();

    return (
        <div className='main lobby'>
            <div className='section'>
                <p>Game code</p>
                <h1 className='game-code'>{game.code}</h1>
            </div>
            <div className='section players-list'>
                <p>Players ready:</p>
                <div className='players'>
                    {
                        albums.map(album => (
                            <div className='player' key={album.userId}>
                                <img alt='' style={{ borderRadius: '50%', width: 40 }} src={album.photoURL} />
                                <p>{album.username}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className='start-cancel-buttons'>
                {
                    (hostUser.userId === user.uid) ?
                        (
                            <>
                                <button onClick={async () => {
                                    const date = new Date();
                                    const expiryTimestamp = date.setSeconds(date.getSeconds() + 60);
                                    return await updateDoc(gameRef, {
                                        code: deleteField(),
                                        stage: 'prompt',
                                        round: 1,
                                        expiryTimestamp
                                    });
                                }}>Start game</button>
                                <button onClick={async () => {
                                    await updateDoc(gameRef, {
                                        stage: 'over'
                                    });
                                    return navigate('/');
                                }}>End game</button>
                            </>
                        ) :
                        (
                            <>
                                <button onClick={async () => {
                                    const newData = { ...game };
                                    delete newData.albums[user.uid];
                                    await updateDoc(gameRef, newData);
                                    return navigate('/');
                                }}>Leave game</button>
                            </>
                        )
                }
            </div>
        </div>
    );
};

export default Lobby;