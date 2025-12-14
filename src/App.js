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

    // Natural Language Search Parser
    const parseNaturalLanguageQuery = (query) => {
        const lowerQuery = query.toLowerCase();
        
        // Genre detection
        const genreMap = {
            'action': ['action', 'fighting', 'combat', 'battle', 'martial arts'],
            'comedy': ['comedy', 'funny', 'humor', 'laugh', 'hilarious', 'comic'],
            'drama': ['drama', 'dramatic', 'emotional', 'touching'],
            'horror': ['horror', 'scary', 'terror', 'creepy', 'frightening', 'haunted'],
            'thriller': ['thriller', 'thrilling', 'suspense', 'suspenseful', 'tense', 'gripping'],
            'romance': ['romance', 'romantic', 'love', 'relationship'],
            'sci-fi': ['sci-fi', 'science fiction', 'futuristic', 'space', 'alien', 'robot', 'cyberpunk'],
            'fantasy': ['fantasy', 'magic', 'magical', 'wizard', 'dragon', 'medieval'],
            'mystery': ['mystery', 'detective', 'investigation', 'whodunit', 'puzzle'],
            'adventure': ['adventure', 'journey', 'quest', 'expedition', 'explore'],
            'crime': ['crime', 'criminal', 'heist', 'gangster', 'mafia'],
            'animation': ['animation', 'animated', 'cartoon'],
            'documentary': ['documentary', 'real story', 'true story', 'biography']
        };

        // Theme/mood detection
        const themeKeywords = {
            'dark': ['dark', 'noir', 'gritty', 'bleak'],
            'intense': ['intense', 'gripping', 'edge of seat'],
            'lighthearted': ['light', 'feel good', 'uplifting', 'cheerful'],
            'epic': ['epic', 'grand', 'spectacular', 'blockbuster'],
            'twist': ['twist', 'plot twist', 'unexpected', 'surprising'],
            'emotional': ['emotional', 'touching', 'moving', 'tearjerker'],
            'fast-paced': ['fast', 'paced', 'quick', 'rapid', 'action-packed']
        };

        // Rating detection
        const ratingKeywords = {
            'high': ['high imdb', 'top rated', 'highly rated', 'best rated', 'good rating', 'high rating', 'great rating'],
            'medium': ['decent rating', 'average rating', 'ok rating'],
            'any': []
        };

        const detectedGenres = [];
        const searchKeywords = [];
        const themes = [];
        let ratingFilter = null;

        // Detect genres
        Object.entries(genreMap).forEach(([genre, keywords]) => {
            if (keywords.some(keyword => lowerQuery.includes(keyword))) {
                detectedGenres.push(genre);
                searchKeywords.push(...keywords.filter(k => lowerQuery.includes(k)));
            }
        });

        // Detect themes
        Object.entries(themeKeywords).forEach(([theme, keywords]) => {
            if (keywords.some(keyword => lowerQuery.includes(keyword))) {
                themes.push(theme);
                searchKeywords.push(...keywords.filter(k => lowerQuery.includes(k)));
            }
        });

        // Detect rating requirements
        if (ratingKeywords.high.some(keyword => lowerQuery.includes(keyword))) {
            ratingFilter = 'high'; // 7.0+
        } else if (ratingKeywords.medium.some(keyword => lowerQuery.includes(keyword))) {
            ratingFilter = 'medium'; // 5.0-7.0
        }

        // Extract additional keywords (remove common words)
        const commonWords = ['a', 'an', 'the', 'with', 'and', 'or', 'for', 'about', 'movie', 'film', 'good', 'great', 'best', 'nice', 'i', 'want', 'like', 'show', 'me', 'but', 'also', 'high', 'imdb', 'rating', 'rated'];
        const words = lowerQuery.split(/\s+/).filter(word => 
            word.length > 2 && 
            !commonWords.includes(word) &&
            !searchKeywords.includes(word)
        );

        return {
            detectedGenres,
            themes,
            keywords: [...new Set([...searchKeywords, ...words])],
            ratingFilter,
            originalQuery: query
        };
    };

    // Smart movie search using natural language
    const smartSearch = async (parsedQuery) => {
        const { detectedGenres, themes, keywords, ratingFilter, originalQuery } = parsedQuery;
        const allMovies = new Map(); // Use Map to avoid duplicates by imdbID

        try {
            setLoading(true);
            setError(null);

            // Search strategy: combine multiple searches
            const searchTerms = [];

            // Add genre-based searches
            detectedGenres.forEach(genre => {
                searchTerms.push(genre);
            });

            // Add theme-based searches
            themes.forEach(theme => {
                searchTerms.push(theme);
            });

            // Add keyword searches
            keywords.slice(0, 3).forEach(keyword => {
                searchTerms.push(keyword);
            });

            // If no specific terms detected, use original query
            if (searchTerms.length === 0) {
                searchTerms.push(originalQuery);
            }

            // Perform searches
            const searchPromises = searchTerms.map(term => 
                fetch(`${API_URL}&s=${encodeURIComponent(term)}`)
                    .then(res => res.json())
                    .catch(() => ({ Response: "False" }))
            );

            const results = await Promise.all(searchPromises);

            // Combine results
            results.forEach(data => {
                if (data.Response === "True" && data.Search) {
                    data.Search.forEach(movie => {
                        if (!allMovies.has(movie.imdbID)) {
                            // Add relevance score
                            movie.relevanceScore = 0;
                            
                            // Score based on genre match
                            detectedGenres.forEach(genre => {
                                if (movie.Title.toLowerCase().includes(genre) || 
                                    movie.Type?.toLowerCase().includes(genre)) {
                                    movie.relevanceScore += 10;
                                }
                            });

                            // Score based on theme match
                            themes.forEach(theme => {
                                if (movie.Title.toLowerCase().includes(theme)) {
                                    movie.relevanceScore += 5;
                                }
                            });

                            // Score based on keyword match
                            keywords.forEach(keyword => {
                                if (movie.Title.toLowerCase().includes(keyword)) {
                                    movie.relevanceScore += 3;
                                }
                            });

                            allMovies.set(movie.imdbID, movie);
                        }
                    });
                }
            });

            let movieArray = Array.from(allMovies.values());

            // If rating filter is requested, fetch detailed info and filter
            if (ratingFilter && movieArray.length > 0) {
                // Fetch detailed info for top 50 movies to get ratings
                const detailedPromises = movieArray.slice(0, 50).map(movie =>
                    fetch(`${API_URL}&i=${movie.imdbID}`)
                        .then(res => res.json())
                        .catch(() => null)
                );

                const detailedResults = await Promise.all(detailedPromises);
                
                movieArray = detailedResults
                    .filter(details => {
                        if (!details || details.Response === "False") return false;
                        
                        const rating = parseFloat(details.imdbRating);
                        if (isNaN(rating)) return false;

                        // Apply rating filter
                        if (ratingFilter === 'high') {
                            return rating >= 7.0;
                        } else if (ratingFilter === 'medium') {
                            return rating >= 5.0 && rating < 7.0;
                        }
                        return true;
                    })
                    .map(details => {
                        // Convert detailed info back to search result format
                        const movie = allMovies.get(details.imdbID);
                        return {
                            ...movie,
                            imdbRating: details.imdbRating,
                            Genre: details.Genre
                        };
                    });
            }

            if (movieArray.length > 0) {
                // Sort by rating if filter applied, otherwise by relevance
                if (ratingFilter) {
                    movieArray.sort((a, b) => {
                        const ratingA = parseFloat(a.imdbRating) || 0;
                        const ratingB = parseFloat(b.imdbRating) || 0;
                        // Primary sort by rating, secondary by relevance
                        if (ratingB !== ratingA) {
                            return ratingB - ratingA;
                        }
                        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
                    });
                } else {
                    movieArray.sort((a, b) => 
                        (b.relevanceScore || 0) - (a.relevanceScore || 0)
                    );
                }
                setMovies(movieArray);
            } else {
                setMovies([]);
                setError('No movies found matching your description. Try different keywords!');
            }
        } catch (err) {
            setError('Failed to search movies. Please try again.');
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const FindMovie = async (title) =>
    {
        // Check if this looks like a natural language query
        const isNaturalLanguage = title.split(' ').length > 2 || 
                                   /thriller|suspense|action|comedy|drama|horror|romantic|scary|funny|dark|intense|thrilling/.test(title.toLowerCase());

        if (isNaturalLanguage) {
            // Use smart search for natural language queries
            const parsedQuery = parseNaturalLanguageQuery(title);
            await smartSearch(parsedQuery);
        } else {
            // Use traditional search for simple title searches
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
                <input 
                    id = "Search_field" 
                    type = "text" 
                    value = {searchTerm} 
                    placeholder = "Try: 'Action movie with thrilling suspense' or 'Superman'" 
                    onChange = {(e) => setSearchTerm(e.target.value)}
                    onKeyPress = {(e) => {
                        if (e.key === 'Enter') {
                            FindMovie(searchTerm);
                        }
                    }}
                />
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