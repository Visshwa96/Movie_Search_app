import React from 'react';
import './MovieDetails.css';

const MovieDetails = ({ movie, onClose }) => {
    if (!movie) return null;

    const getRatingColor = (rating) => {
        const score = parseFloat(rating);
        if (score >= 8) return '#06ffa5';
        if (score >= 7) return '#00f5ff';
        if (score >= 6) return '#a855f7';
        return '#ff006e';
    };

    return (
        <div className="movie-details-overlay" onClick={onClose}>
            <div className="movie-details-modal" onClick={(e) => e.stopPropagation()}>
                <button className="details-close" onClick={onClose}>×</button>
                
                <div className="details-content">
                    {/* Poster Section */}
                    <div className="details-poster">
                        <img 
                            src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400x600'} 
                            alt={movie.Title}
                        />
                    </div>

                    {/* Info Section */}
                    <div className="details-info">
                        <h1>{movie.Title}</h1>
                        
                        <div className="details-meta">
                            <span className="year">{movie.Year}</span>
                            {movie.Rated && <span className="rated">{movie.Rated}</span>}
                            {movie.Runtime && <span className="runtime">{movie.Runtime}</span>}
                        </div>

                        {/* Ratings */}
                        {movie.Ratings && movie.Ratings.length > 0 && (
                            <div className="details-ratings">
                                {movie.Ratings.map((rating, index) => (
                                    <div key={index} className="rating-badge">
                                        <span className="rating-source">{rating.Source}</span>
                                        <span 
                                            className="rating-value" 
                                            style={{ color: getRatingColor(rating.Value) }}
                                        >
                                            {rating.Value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* IMDB Rating (if no Ratings array) */}
                        {movie.imdbRating && !movie.Ratings && (
                            <div className="imdb-score">
                                <span className="score-label">IMDB</span>
                                <span 
                                    className="score-value" 
                                    style={{ color: getRatingColor(movie.imdbRating) }}
                                >
                                    ⭐ {movie.imdbRating}
                                </span>
                                {movie.imdbVotes && (
                                    <span className="votes">({movie.imdbVotes} votes)</span>
                                )}
                            </div>
                        )}

                        {/* Genre */}
                        {movie.Genre && (
                            <div className="details-section">
                                <h3>Genre</h3>
                                <div className="genre-tags">
                                    {movie.Genre.split(', ').map((genre, index) => (
                                        <span key={index} className="genre-tag">{genre}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Plot */}
                        {movie.Plot && movie.Plot !== 'N/A' && (
                            <div className="details-section">
                                <h3>Plot</h3>
                                <p className="plot-text">{movie.Plot}</p>
                            </div>
                        )}

                        {/* Director */}
                        {movie.Director && movie.Director !== 'N/A' && (
                            <div className="details-section">
                                <h3>Director</h3>
                                <p>{movie.Director}</p>
                            </div>
                        )}

                        {/* Actors */}
                        {movie.Actors && movie.Actors !== 'N/A' && (
                            <div className="details-section">
                                <h3>Cast</h3>
                                <p>{movie.Actors}</p>
                            </div>
                        )}

                        {/* Writer */}
                        {movie.Writer && movie.Writer !== 'N/A' && (
                            <div className="details-section">
                                <h3>Writer</h3>
                                <p className="writer-text">{movie.Writer}</p>
                            </div>
                        )}

                        {/* Language & Country */}
                        <div className="details-section">
                            <div className="meta-grid">
                                {movie.Language && movie.Language !== 'N/A' && (
                                    <div className="meta-item">
                                        <span className="meta-label">Language</span>
                                        <span className="meta-value">{movie.Language}</span>
                                    </div>
                                )}
                                {movie.Country && movie.Country !== 'N/A' && (
                                    <div className="meta-item">
                                        <span className="meta-label">Country</span>
                                        <span className="meta-value">{movie.Country}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Awards */}
                        {movie.Awards && movie.Awards !== 'N/A' && (
                            <div className="details-section awards-section">
                                <h3>🏆 Awards</h3>
                                <p className="awards-text">{movie.Awards}</p>
                            </div>
                        )}

                        {/* Box Office */}
                        {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                            <div className="details-section">
                                <h3>Box Office</h3>
                                <p className="boxoffice-text">{movie.BoxOffice}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
