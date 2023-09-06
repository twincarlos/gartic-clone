function DrawHeader({ game, albums, seconds }) {
    function checkIfReady(i) {
        const index = (i + game.round - 1 < albums.length) ? (i + game.round - 1) : ((i + game.round - 1) - albums.length);
        if (albums[index].tasks && game.round in albums[index].tasks) {
            return true;
        };
        return false;
    };

    return (
        <div className='header'>
            <div className='player-statuses'>
                {
                    albums.map((album, i) => (
                        <img alt='' className={`player-status-img ${checkIfReady(i) ? 'ready' : 'not-ready'}`} src={album.photoURL} key={album.userId}/>
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

export default DrawHeader;