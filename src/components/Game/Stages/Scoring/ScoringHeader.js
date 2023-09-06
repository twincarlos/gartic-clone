function ScoringHeader({ albums, task }) {
    return (
        <div className='header'>
            <div className='player-statuses'>
                {
                    albums.map(album => (
                        <img alt='' className={`player-status-img ${task.scores.includes(album.userId) ? 'ready' : 'not-ready'} ${task.userId === album.userId ? 'self' : ''}`} src={album.photoURL} key={album.userId}/>
                    ))
                }
            </div>
        </div>
    );
};

export default ScoringHeader;