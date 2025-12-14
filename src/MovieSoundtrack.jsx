import React, { useState, useEffect } from 'react';

const MovieSoundtrack = ({ movie, onClose }) => {
    const [videoId, setVideoId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

    useEffect(() => {
        if (movie && YOUTUBE_API_KEY) {
            searchSoundtrack();
        } else if (movie) {
            setError('YouTube API key not configured');
            setLoading(false);
        }
    }, [movie]);

    const searchSoundtrack = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const query = encodeURIComponent(`${movie.Title} ${movie.Year} soundtrack full album`);
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&type=video&key=${YOUTUBE_API_KEY}`
            );
            
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                setVideoId(data.items[0].id.videoId);
            } else {
                setError('No soundtrack found for this movie');
            }
        } catch (err) {
            setError('Failed to load soundtrack');
        } finally {
            setLoading(false);
        }
    };

    const getSearchUrl = () => {
        const query = encodeURIComponent(`${movie.Title} ${movie.Year} soundtrack`);
        return `https://www.youtube.com/results?search_query=${query}`;
    };

    if (!movie) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="soundtrack-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                
                <div className="soundtrack-header">
                    <h2>🎵 {movie.Title} Soundtrack</h2>
                    <p className="soundtrack-year">{movie.Year}</p>
                </div>

                <div className="soundtrack-content">
                    {loading ? (
                        <div className="soundtrack-loading">
                            <p>🎵 Loading soundtrack...</p>
                        </div>
                    ) : error ? (
                        <div className="soundtrack-error">
                            <p>{error}</p>
                            <div className="youtube-search-section">
                                <a 
                                    href={getSearchUrl()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="youtube-search-btn"
                                >
                                    <span className="youtube-icon">▶️</span>
                                    <span>Search on YouTube Instead</span>
                                </a>
                            </div>
                        </div>
                    ) : videoId ? (
                        <>
                            <div className="youtube-player">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
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
                                    Use player controls to play, pause, and adjust volume
                                </p>
                            </div>

                            <div className="player-tips">
                                <div className="tip">
                                    <span className="tip-icon">▶️</span>
                                    <span>Click play to start listening</span>
                                </div>
                                <div className="tip">
                                    <span className="tip-icon">🔊</span>
                                    <span>Adjust volume in player</span>
                                </div>
                                <div className="tip">
                                    <span className="tip-icon">⚙️</span>
                                    <span>Change quality settings</span>
                                </div>
                            </div>

                            <div className="alternative-platforms">
                                <h3>More soundtrack options:</h3>
                                <div className="music-platforms">
                                    <a 
                                        href={getSearchUrl()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="platform-link-music"
                                    >
                                        <span className="platform-icon-music">🎬</span>
                                        More on YouTube
                                    </a>
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
                                        <span className="platform-icon-music">📱</span>
                                        YT Music
                                    </a>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default MovieSoundtrack;
