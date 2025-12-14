import React from 'react';

const Movie = ({ movie, onMovieClick }) => {
    return(
<div className = "movie" onClick={() => onMovieClick(movie.Title)}>
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
</div>
    );
}
export default Movie;