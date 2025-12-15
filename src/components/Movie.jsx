import React from 'react';

const Movie = ({ movie, onMovieClick, onWatchOptionsClick, onSoundtrackClick }) => {
    
    const handleMovieClick = (e) => {
        // If click is on music button, show soundtrack
        if (e.target.closest('.music-btn')) {
            e.stopPropagation();
            onSoundtrackClick(movie);
        }
        // If click is on watch button, show watch options
        else if (e.target.closest('.watch-btn')) {
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
        {movie.imdbRating && (
            <p className="imdb-rating">⭐ {movie.imdbRating}</p>
        )}
        {movie.Language && (
            <p className="movie-language">🌐 {movie.Language.split(',')[0]}</p>
        )}
    </div>
    <div>
    <img src = {movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400'} alt={movie.Title}/>
    </div>
    <div>
        <span>{movie.Type}</span>
        <h3>{movie.Title}</h3>
        {movie.Genre && (
            <p className="movie-genres">{movie.Genre}</p>
        )}
    </div>
    <div className="play-icon">▶</div>
    <button className="watch-btn" title="Where to watch">
        📺
    </button>
    <button className="music-btn" title="Listen to soundtrack">
        🎵
    </button>
</div>
    );
}
export default Movie;