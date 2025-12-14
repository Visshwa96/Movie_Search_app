import React from 'react';

const Movie = ({ movie, onMovieClick, onWatchOptionsClick }) => {
    
    const handleMovieClick = (e) => {
        // If click is on watch button, show watch options
        if (e.target.closest('.watch-btn')) {
            e.stopPropagation();
            onWatchOptionsClick(movie);
        } else {
            // Otherwise show trailer
            onMovieClick(movie.Title);
        }
    };

    return(
<div className = "movie" onClick={handleMovieClick}>
    <div>
        <p>{movie.Year}</p>
    </div>
    <div>
    <img src = {movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400'} alt={movie.Title}/>
    </div>
    <div>
        <span>{movie.Type}</span>
        <h3>{movie.Title}</h3>
    </div>
    <div className="play-icon">▶</div>
    <button className="watch-btn" title="Where to watch">
        📺
    </button>
</div>
    );
}
export default Movie;