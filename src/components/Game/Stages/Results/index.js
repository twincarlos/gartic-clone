import { useNavigate } from "react-router-dom";
import './Results.css';

function Results({ game }) {
    const navigate = useNavigate();
    const albums = Object.values(game.albums).sort((a, b) => b.score - a.score);

    return (
        <div className='main results'>
            <p>Results:</p>
            <div className='podium'>
                {
                    albums.map((album, i) => (
                        <div className='position' key={album.userId}>
                            <h2 style={{ margin: 0 }}>{i + 1}.</h2>
                            <img alt='' src={album.photoURL} />
                            <h2>{album.username}</h2>
                            <p>{album.score} points</p>
                        </div>
                    ))
                }
            </div>
            <button onClick={() => {
                navigate('/');
            }}>Back home</button>
        </div>
    );
};

export default Results;