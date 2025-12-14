import React from 'react';

const MovieSoundtrack = ({ movie, onClose }) => {

    if (!movie) return null;

    // Create YouTube search URL that opens in the embedded player
    const getSearchUrl = () => {
        const query = encodeURIComponent(`${movie.Title} ${movie.Year} soundtrack full album`);
        return `https://www.youtube.com/results?search_query=${query}`;
    };

    // Create direct YouTube search embed that users can interact with
    const getEmbedSearchUrl = () => {
        const query = encodeURIComponent(`${movie.Title} soundtrack`);
        return `https://www.youtube.com/embed/videoseries?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf&search_query=${query}`;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="soundtrack-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                
                <div className="soundtrack-header">
                    <h2>🎵 {movie.Title} Soundtrack</h2>
                    <p className="soundtrack-year">{movie.Year}</p>
                </div>

                <div className="soundtrack-content">
                    <div className="soundtrack-info">
                        <p className="info-text">
                            🎧 Listen to soundtrack from <strong>{movie.Title}</strong>
                        </p>
                        <p className="info-subtext">
                            Click the button below to search and play soundtracks on YouTube
                        </p>
                    </div>

                    <div className="youtube-search-section">
                        <a 
                            href={getSearchUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="youtube-search-btn"
                        >
                            <span className="youtube-icon">▶️</span>
                            <span>Search "{movie.Title} Soundtrack" on YouTube</span>
                        </a>
                        <p className="search-hint">Opens YouTube in a new tab with soundtrack results</p>
                    </div>

                    <div className="player-tips">
                        <div className="tip">
                            <span className="tip-icon">🎵</span>
                            <span>Full soundtrack albums available</span>
                        </div>
                        <div className="tip">
                            <span className="tip-icon">🎼</span>
                            <span>Original movie scores and songs</span>
                        </div>
                        <div className="tip">
                            <span className="tip-icon">🔊</span>
                            <span>High quality audio playback</span>
                        </div>
                    </div>

                    <div className="alternative-platforms">
                        <h3>Or listen on other platforms:</h3>
                        <div className="music-platforms">
                            <a 
                                href={`https://open.spotify.com/search/${encodeURIComponent(movie.Title + ' soundtrack')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="platform-link-music"
                            >
                                <span className="platform-icon-music">🎧</span>
                                Spotify
                            </a>
                            <a 
                                href={`https://music.apple.com/search?term=${encodeURIComponent(movie.Title + ' soundtrack')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="platform-link-music"
                            >
                                <span className="platform-icon-music">🍎</span>
                                Apple Music
                            </a>
                            <a 
                                href={`https://music.youtube.com/search?q=${encodeURIComponent(movie.Title + ' soundtrack')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="platform-link-music"
                            >
                                <span className="platform-icon-music">🎬</span>
                                YouTube Music
                            </a>
                            <a 
                                href={`https://www.amazon.com/s?k=${encodeURIComponent(movie.Title + ' soundtrack')}&i=digital-music`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="platform-link-music"
                            >
                                <span className="platform-icon-music">🛒</span>
                                Amazon Music
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieSoundtrack;
