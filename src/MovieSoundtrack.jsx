import React, { useState, useEffect } from 'react';

const MovieSoundtrack = ({ movie, onClose }) => {
    const [playlist, setPlaylist] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

    useEffect(() => {
        if (movie && YOUTUBE_API_KEY) {
            searchSoundtracks();
        } else if (movie) {
            setError('YouTube API key not configured');
            setLoading(false);
        }
    }, [movie]);

    const searchSoundtracks = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const query = encodeURIComponent(`${movie.Title} soundtrack`);
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&type=video&videoCategoryId=10&key=${YOUTUBE_API_KEY}`
            );
            
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                const videos = data.items.map(item => ({
                    id: item.id.videoId,
                    title: item.snippet.title,
                    thumbnail: item.snippet.thumbnails.medium.url,
                    channelTitle: item.snippet.channelTitle
                }));
                setPlaylist(videos);
                setSelectedVideo(videos[0]); // Auto-select first song
            } else {
                setError('No soundtrack found for this movie');
            }
        } catch (err) {
            setError('Failed to load soundtracks');
        } finally {
            setLoading(false);
        }
    };

    const handleSongSelect = (video) => {
        setSelectedVideo(video);
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
                            <p>🎵 Loading soundtracks...</p>
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
                    ) : playlist.length > 0 ? (
                        <div className="music-player-container">
                            {/* Now Playing Section */}
                            <div className="now-playing-section">
                                <h3>🎵 Now Playing</h3>
                                {selectedVideo && (
                                    <>
                                        <div className="youtube-player">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=0`}
                                                title={selectedVideo.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                        <div className="current-song-info">
                                            <p className="current-song-title">{selectedVideo.title}</p>
                                            <p className="current-song-channel">{selectedVideo.channelTitle}</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Playlist Section */}
                            <div className="playlist-section">
                                <h3>📋 Soundtrack Playlist ({playlist.length} songs)</h3>
                                <div className="playlist-container">
                                    {playlist.map((video, index) => (
                                        <div 
                                            key={video.id}
                                            className={`playlist-item ${selectedVideo?.id === video.id ? 'active' : ''}`}
                                            onClick={() => handleSongSelect(video)}
                                        >
                                            <div className="playlist-item-number">
                                                {selectedVideo?.id === video.id ? '▶️' : index + 1}
                                            </div>
                                            <img 
                                                src={video.thumbnail} 
                                                alt={video.title}
                                                className="playlist-thumbnail"
                                            />
                                            <div className="playlist-item-details">
                                                <p className="playlist-item-title">{video.title}</p>
                                                <p className="playlist-item-channel">{video.channelTitle}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="alternative-platforms">
                                <h3>More Options:</h3>
                                <div className="music-platforms">
                                    <a 
                                        href={getSearchUrl()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="platform-link-music"
                                    >
                                        <span className="platform-icon-music">🎬</span>
                                        YouTube
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
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default MovieSoundtrack;
