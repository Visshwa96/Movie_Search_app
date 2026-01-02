import React from 'react';
import './Favorites.css';

const Favorites = ({ favorites, onClose, onRemoveFavorite, onMovieClick }) => {
    if (!favorites || favorites.length === 0) {
        return (
            <div className="favorites-overlay" onClick={onClose}>
                <div className="favorites-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="favorites-header">
                        <h2>❤️ My Favorites</h2>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                    <div className="favorites-empty">
                        <p>No favorites yet!</p>
                        <p>Click the ❤️ button on any movie to add it here.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="favorites-overlay" onClick={onClose}>
            <div className="favorites-modal" onClick={(e) => e.stopPropagation()}>
                <div className="favorites-header">
                    <h2>❤️ My Favorites ({favorites.length})</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="favorites-content">
                    <div className="favorites-grid">
                        {favorites.map((movie) => (
                            <div key={movie.imdbID} className="favorite-card">
                                <img 
                                    src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450'} 
                                    alt={movie.Title}
                                    onClick={() => onMovieClick(movie)}
                                />
                                <div className="favorite-info">
                                    <h3>{movie.Title}</h3>
                                    <p>{movie.Year} • {movie.Type}</p>
                                    {movie.imdbRating && (
                                        <p className="rating">⭐ {movie.imdbRating}</p>
                                    )}
                                </div>
                                <button 
                                    className="remove-favorite-btn"
                                    onClick={() => onRemoveFavorite(movie.imdbID)}
                                    title="Remove from favorites"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Favorites;
