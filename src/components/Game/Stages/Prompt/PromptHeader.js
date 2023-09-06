function PromptHeader({ game, seconds }) {
    const albums = Object.values(game.albums);

    return (
        <div className='header'>
            <div className='player-statuses'>
                {
                    albums.map(album => (
                        <img alt='' className={`player-status-img ${('prompt' in game.albums[album.userId]) ? 'ready' : 'not-ready'}`} src={album.photoURL} key={album.userId}/>
                    ))
                }
            </div>
            <div className='game-info'>
                <p>Round <strong>{game.round}</strong> /{albums.length}</p>
                <p>Clock <strong>{seconds}</strong></p>
            </div>
        </div>
    );
};

export default PromptHeader;