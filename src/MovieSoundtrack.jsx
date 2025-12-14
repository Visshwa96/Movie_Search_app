import React, { useState, useEffect } from 'react';

const MovieSoundtrack = ({ movie, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (movie) {
            // Create search query for movie soundtrack
            setSearchQuery(`${movie.Title} ${movie.Year} soundtrack full album`);
        }
    }, [movie]);

    if (!movie) return null;

    // Create YouTube embed URL - this will show search results as a playlist
    const getEmbedUrl = () => {
        const query = encodeURIComponent(searchQuery);
        // Use YouTube embed with search query - this creates a playlist of matching videos
        return `https://www.youtube.com/embed?listType=search&list=${query}`;
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
                    <div className="youtube-player">
                        <iframe
                            width="100%"
                            height="100%"
                            src={getEmbedUrl()}
                            title={`${movie.Title} Soundtrack`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                    
                    <div className="soundtrack-info">
                        <p className="info-text">
                            🎧 Playing soundtrack from <strong>{movie.Title}</strong>
                        </p>
                        <p className="info-subtext">
                            Click on any song from the playlist to start listening
                        </p>
                    </div>

                    <div className="player-tips">
                        <div className="tip">
                            <span className="tip-icon">▶️</span>
                            <span>Click play on any song to start</span>
                        </div>
                        <div className="tip">
                            <span className="tip-icon">📋</span>
                            <span>Browse playlist for more tracks</span>
                        </div>
                        <div className="tip">
                            <span className="tip-icon">🔊</span>
                            <span>Adjust volume in player controls</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieSoundtrack;
