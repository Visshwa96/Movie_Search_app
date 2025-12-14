import React from 'react';
import {useState,  useEffect} from 'react';
import SearchIcon from './Search.svg'
import Movie from './Movie.jsx'
import TrailerModal from './TrailerModal.jsx'
import WatchOptions from './WatchOptions.jsx'
import MovieSoundtrack from './MovieSoundtrack.jsx'
import UserPreferences from './UserPreferences.jsx'
import './App.css'

//step 1: Define the Api url which means that the data is going to be fetched from this API
const API_URL = `https://www.omdbapi.com?apikey=${process.env.REACT_APP_OMDB_API_KEY || 'b9b8bdbc'}`;
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

export const App = () =>{
    const [movie , setMovies] = useState([]);
    const [searchTerm , setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [trailerVideoId, setTrailerVideoId] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [soundtrackMovie, setSoundtrackMovie] = useState(null);
    const [showPreferences, setShowPreferences] = useState(false);
    const [userPreferences, setUserPreferences] = useState(() => {
        const saved = localStorage.getItem('moviePreferences');
        return saved ? JSON.parse(saved) : null;
    });
    // let movie_text = document.getElementById({Search_field})
    //Movie Fetching Mechanics

    const FindMovie = async (title) =>
    {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}&s=${title}`);
            const data = await response.json();
            
            if (data.Response === "True") {
                setMovies(data.Search);
            } else {
                setMovies([]);
                setError(data.Error || 'No movies found');
            }
        } catch (err) {
            setError('Failed to fetch movies. Please try again.');
            setMovies([]);
        } finally {
            setLoading(false);
        }
    }

    const fetchTrailer = async (movieTitle) => {
        if (!YOUTUBE_API_KEY) {
            alert('YouTube API key is missing. Please add REACT_APP_YOUTUBE_API_KEY to your .env file.');
            return;
        }
        
        try {
            const response = await fetch(
                `${YOUTUBE_API_URL}?part=snippet&maxResults=1&q=${encodeURIComponent(movieTitle + ' official trailer')}&key=${YOUTUBE_API_KEY}`
            );
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                setTrailerVideoId(data.items[0].id.videoId);
            } else {
                alert('Trailer not found for this movie.');
            }
        } catch (err) {
            alert('Failed to fetch trailer. Please try again.');
        }
    }

    const handleMovieClick = (movieTitle) => {
        fetchTrailer(movieTitle);
    }

    const closeTrailer = () => {
        setTrailerVideoId(null);
    }

    const handleWatchOptionsClick = (movie) => {
        setSelectedMovie(movie);
    }

    const closeWatchOptions = () => {
        setSelectedMovie(null);
    }

    const handleSoundtrackClick = (movie) => {
        setSoundtrackMovie(movie);
    }

    const closeSoundtrack = () => {
        setSoundtrackMovie(null);
    }

    const handleSavePreferences = (prefs) => {
        setUserPreferences(prefs);
        localStorage.setItem('moviePreferences', JSON.stringify(prefs));
    }

    const openPreferences = () => {
        setShowPreferences(true);
    }

    const closePreferences = () => {
        setShowPreferences(false);
    }

    const sortMoviesByPreferences = (movies) => {
        if (!userPreferences || !userPreferences.favoriteGenres.length) {
            return movies;
        }

        return [...movies].sort((a, b) => {
            let scoreA = 0;
            let scoreB = 0;

            // Check if movie title/plot matches preferred genres (approximate)
            const genreKeywords = {
                'Action': ['action', 'fight', 'battle', 'hero', 'combat'],
                'Comedy': ['comedy', 'funny', 'laugh', 'humor'],
                'Drama': ['drama', 'story', 'life', 'family'],
                'Horror': ['horror', 'scary', 'terror', 'fear'],
                'Romance': ['romance', 'love', 'romantic'],
                'Sci-Fi': ['sci-fi', 'future', 'space', 'alien', 'robot'],
                'Thriller': ['thriller', 'suspense', 'mystery'],
                'Fantasy': ['fantasy', 'magic', 'wizard', 'dragon']
            };

            userPreferences.favoriteGenres.forEach(genre => {
                const keywords = genreKeywords[genre] || [];
                const movieInfo = `${a.Title} ${a.Type}`.toLowerCase();
                if (keywords.some(keyword => movieInfo.includes(keyword))) {
                    scoreA += 10;
                }
                const movieInfoB = `${b.Title} ${b.Type}`.toLowerCase();
                if (keywords.some(keyword => movieInfoB.includes(keyword))) {
                    scoreB += 10;
                }
            });

            // Prefer movies from favorite decades
            if (userPreferences.favoriteDecades.length > 0) {
                const yearA = parseInt(a.Year);
                const yearB = parseInt(b.Year);
                
                userPreferences.favoriteDecades.forEach(decade => {
                    if (decade === '2020s' && yearA >= 2020) scoreA += 5;
                    if (decade === '2010s' && yearA >= 2010 && yearA < 2020) scoreA += 5;
                    if (decade === '2000s' && yearA >= 2000 && yearA < 2010) scoreA += 5;
                    if (decade === '1990s' && yearA >= 1990 && yearA < 2000) scoreA += 5;
                    if (decade === '1980s' && yearA >= 1980 && yearA < 1990) scoreA += 5;
                    
                    if (decade === '2020s' && yearB >= 2020) scoreB += 5;
                    if (decade === '2010s' && yearB >= 2010 && yearB < 2020) scoreB += 5;
                    if (decade === '2000s' && yearB >= 2000 && yearB < 2010) scoreB += 5;
                    if (decade === '1990s' && yearB >= 1990 && yearB < 2000) scoreB += 5;
                    if (decade === '1980s' && yearB >= 1980 && yearB < 1990) scoreB += 5;
                });
            }

            return scoreB - scoreA; // Higher score first
        });
    }

    useEffect(() => {
        FindMovie('superman');
        // Show preferences modal on first visit
        if (!userPreferences && !localStorage.getItem('preferencesShown')) {
            setTimeout(() => {
                setShowPreferences(true);
                localStorage.setItem('preferencesShown', 'true');
            }, 1000);
        }
    },[])
    const sortedMovies = sortMoviesByPreferences(movie);

    return(
        <div className = "app">
            <div className="app-header">
                <h1>Visshwa Movie App</h1>
                <button className="preferences-btn" onClick={openPreferences} title="Personalize your experience">
                    ⚙️ Preferences
                </button>
            </div>
            <div className = "search">
                <input id = "Search_field" type = "text" value = {searchTerm} placeholder = "Search for Movies" onChange = {(e) => setSearchTerm(e.target.value)}/>
                <img src = {SearchIcon} onClick = {() => {FindMovie(searchTerm)} }/>
            </div>
            {userPreferences && userPreferences.favoriteGenres.length > 0 && (
                <div className="active-preferences">
                    <span>🎯 Personalized for you:</span>
                    <div className="pref-tags">
                        {userPreferences.favoriteGenres.slice(0, 3).map((genre, index) => (
                            <span key={index} className="pref-tag">{genre}</span>
                        ))}
                        {userPreferences.favoriteGenres.length > 3 && (
                            <span className="pref-tag">+{userPreferences.favoriteGenres.length - 3} more</span>
                        )}
                    </div>
                </div>
            )}
            {/* step3 : dynamically change the movie page by writing a simple condition */}
            { 
                loading ? (
                    <div className = "empty">
                        <h2>Loading...</h2>
                    </div>
                ) : error ? (
                    <div className = "empty">
                        <h2>{error}</h2>
                    </div>
                ) : sortedMovies.length > 0 ? (
                    <div className = "container">
                        {sortedMovies.map((movie) => (
                            <Movie 
                                key={movie.imdbID} 
                                movie = {movie} 
                                onMovieClick={handleMovieClick}
                                onWatchOptionsClick={handleWatchOptionsClick}
                                onSoundtrackClick={handleSoundtrackClick}
                            />
                        ) ) }
                    </div>
                ) : (
                    <div className = "empty">
                        <h2>No Movies</h2>
                    </div>
                )
            }
            
            <TrailerModal videoId={trailerVideoId} onClose={closeTrailer} />
            <WatchOptions movie={selectedMovie} onClose={closeWatchOptions} />
            <MovieSoundtrack movie={soundtrackMovie} onClose={closeSoundtrack} />
            {showPreferences && (
                <UserPreferences 
                    onSave={handleSavePreferences} 
                    onClose={closePreferences}
                    currentPreferences={userPreferences}
                />
            )}
        </div>

    );

}