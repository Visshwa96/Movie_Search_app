import React, { useState, useEffect } from 'react';

const WatchOptions = ({ movie, onClose }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!movie) return;
        setLoading(false);
    }, [movie]);

    if (!movie) return null;

    const isRecentRelease = () => {
        const currentYear = new Date().getFullYear();
        const movieYear = parseInt(movie.Year);
        return currentYear - movieYear <= 1; // Released within last year
    };

    const getTheaterLink = () => {
        const movieTitle = encodeURIComponent(movie.Title);
        return `https://www.google.com/search?q=${movieTitle}+movie+showtimes+near+me`;
    };

    const streamingPlatforms = [
        {
            name: 'Netflix',
            icon: '🎬',
            searchUrl: `https://www.netflix.com/search?q=${encodeURIComponent(movie.Title)}`,
            color: '#E50914'
        },
        {
            name: 'Prime Video',
            icon: '📺',
            searchUrl: `https://www.amazon.com/s?k=${encodeURIComponent(movie.Title)}&i=instant-video`,
            color: '#00A8E1'
        },
        {
            name: 'Disney+',
            icon: '🏰',
            searchUrl: `https://www.disneyplus.com/search?q=${encodeURIComponent(movie.Title)}`,
            color: '#113CCF'
        },
        {
            name: 'HBO Max',
            icon: '🎭',
            searchUrl: `https://www.max.com/search?q=${encodeURIComponent(movie.Title)}`,
            color: '#B024C8'
        },
        {
            name: 'Hulu',
            icon: '📱',
            searchUrl: `https://www.hulu.com/search?q=${encodeURIComponent(movie.Title)}`,
            color: '#1CE783'
        },
        {
            name: 'Apple TV+',
            icon: '🍎',
            searchUrl: `https://tv.apple.com/search?q=${encodeURIComponent(movie.Title)}`,
            color: '#000000'
        }
    ];

    const rentalPlatforms = [
        {
            name: 'YouTube',
            icon: '▶️',
            searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + ' rent')}`,
            color: '#FF0000'
        },
        {
            name: 'Google Play',
            icon: '🎮',
            searchUrl: `https://play.google.com/store/search?q=${encodeURIComponent(movie.Title)}&c=movies`,
            color: '#01875F'
        },
        {
            name: 'iTunes',
            icon: '🎵',
            searchUrl: `https://tv.apple.com/search?q=${encodeURIComponent(movie.Title)}`,
            color: '#FA57C1'
        }
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="watch-options-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                
                <div className="watch-options-header">
                    <h2>{movie.Title}</h2>
                    <p className="movie-year">{movie.Year} • {movie.Type}</p>
                </div>

                <div className="watch-options-content">
                    {/* Theater Status - Show if recent release */}
                    {isRecentRelease() && (
                        <div className="watch-section theater-section">
                            <h3>🎬 Check Theaters</h3>
                            <p>Find if this movie is currently playing in theaters near you</p>
                            <a 
                                href={getTheaterLink()} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="theater-btn"
                            >
                                Find Showtimes Near You
                            </a>
                        </div>
                    )}

                    {/* Streaming Platforms */}
                    <div className="watch-section">
                        <h3>📺 Search on Streaming Platforms</h3>
                        <p className="section-description">Click to search on your favorite platform</p>
                        <div className="providers-grid">
                            {streamingPlatforms.map((platform) => (
                                <a 
                                    key={platform.name}
                                    href={platform.searchUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="provider-card platform-link"
                                    title={`Search on ${platform.name}`}
                                >
                                    <div className="provider-icon" style={{background: platform.color}}>
                                        {platform.icon}
                                    </div>
                                    <span>{platform.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Rental/Purchase Options */}
                    <div className="watch-section">
                        <h3>💰 Rent or Buy</h3>
                        <p className="section-description">Search for rental and purchase options</p>
                        <div className="providers-grid">
                            {rentalPlatforms.map((platform) => (
                                <a 
                                    key={platform.name}
                                    href={platform.searchUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="provider-card platform-link"
                                    title={`Search on ${platform.name}`}
                                >
                                    <div className="provider-icon" style={{background: platform.color}}>
                                        {platform.icon}
                                    </div>
                                    <span>{platform.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Search Options */}
                    <div className="watch-section">
                        <h3>🔍 More Options</h3>
                        <div className="quick-links">
                            <a 
                                href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(movie.Title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="quick-link-btn"
                            >
                                🌐 JustWatch (All Platforms)
                            </a>
                            <a 
                                href={`https://www.google.com/search?q=${encodeURIComponent(movie.Title + ' where to watch')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="quick-link-btn"
                            >
                                🔎 Google Search
                            </a>
                            <a 
                                href={`https://www.imdb.com/find?q=${encodeURIComponent(movie.Title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="quick-link-btn"
                            >
                                ⭐ IMDb
                            </a>
                        </div>
                    </div>

                    {/* Movie Info from OMDB */}
                    <div className="watch-section movie-info">
                        <h3>ℹ️ Movie Info</h3>
                        <p><strong>Title:</strong> {movie.Title}</p>
                        <p><strong>Year:</strong> {movie.Year}</p>
                        <p><strong>Type:</strong> {movie.Type}</p>
                        {movie.imdbID && (
                            <p>
                                <strong>IMDb:</strong> 
                                <a 
                                    href={`https://www.imdb.com/title/${movie.imdbID}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="imdb-link"
                                >
                                    View on IMDb ↗
                                </a>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchOptions;
