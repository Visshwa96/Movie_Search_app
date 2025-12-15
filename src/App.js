import React, { useState, useEffect } from "react";
import SearchIcon from "./Search.svg";
import Movie from "./components/Movie";
import TrailerModal from "./components/TrailerModal";
import WatchOptions from "./components/WatchOptions";
import MovieSoundtrack from "./components/MovieSoundtrack";
import UserPreferences from "./components/UserPreferences";

import { parseNaturalLanguageQuery } from "./utils/parseNaturalLanguageQuery";
import { smartSearch } from "./utils/smartSearch";

import "./App.css";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [trailerVideoId, setTrailerVideoId] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [soundtrackMovie, setSoundtrackMovie] = useState(null);

  const [showPreferences, setShowPreferences] = useState(
    !localStorage.getItem("preferencesCompleted")
  );

  const findMovie = async query => {
    try {
      setLoading(true);
      setError(null);

            // Search strategy: combine multiple searches
            const searchTerms = [];

            // Add platform-specific searches (priority for discovery)
            if (detectedPlatforms.length > 0) {
                detectedPlatforms.forEach(platform => {
                    searchTerms.push(platform);
                });
            }

            // Add genre-based searches
            detectedGenres.forEach(genre => {
                searchTerms.push(genre);
            });

            // Add theme-based searches
            themes.forEach(theme => {
                searchTerms.push(theme);
            });

            // Add language-based searches
            if (detectedLanguages.length > 0) {
                detectedLanguages.forEach(lang => {
                    searchTerms.push(lang);
                });
            }

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
                            // Filter by type if specified
                            if (detectedTypes.length > 0) {
                                const movieType = movie.Type?.toLowerCase() || '';
                                let typeMatches = false;
                                
                                detectedTypes.forEach(type => {
                                    if (type === 'series' && movieType === 'series') typeMatches = true;
                                    if (type === 'movie' && movieType === 'movie') typeMatches = true;
                                });
                                
                                if (!typeMatches) return; // Skip if type doesn't match
                            }
                            
                            // Add relevance score
                            movie.relevanceScore = 0;
                            
                            // Score based on platform match (boost significantly)
                            detectedPlatforms.forEach(platform => {
                                if (movie.Title.toLowerCase().includes(platform)) {
                                    movie.relevanceScore += 15;
                                }
                            });
                            
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

                            // Score based on type match
                            if (detectedTypes.length > 0 && movie.Type) {
                                detectedTypes.forEach(type => {
                                    if (type === 'series' && movie.Type.toLowerCase() === 'series') {
                                        movie.relevanceScore += 8;
                                    }
                                    if (type === 'movie' && movie.Type.toLowerCase() === 'movie') {
                                        movie.relevanceScore += 8;
                                    }
                                });
                            }

                            allMovies.set(movie.imdbID, movie);
                        }
                    });
                }
            });

            let movieArray = Array.from(allMovies.values());

            // If rating filter or language filter is requested, fetch detailed info and filter
            if ((ratingFilter || detectedLanguages.length > 0) && movieArray.length > 0) {
                // Fetch detailed info for top 80 movies to get ratings and language
                const detailedPromises = movieArray.slice(0, 80).map(movie =>
                    fetch(`${API_URL}&i=${movie.imdbID}`)
                        .then(res => res.json())
                        .catch(() => null)
                );

                const detailedResults = await Promise.all(detailedPromises);
                
                movieArray = detailedResults
                    .filter(details => {
                        if (!details || details.Response === "False") return false;
                        
                        // Apply rating filter
                        if (ratingFilter) {
                            const rating = parseFloat(details.imdbRating);
                            if (isNaN(rating)) return false;

                            if (ratingRange) {
                                // Use specific rating range
                                if (rating < ratingRange.min || rating > ratingRange.max) {
                                    return false;
                                }
                            } else if (ratingFilter === 'high') {
                                if (rating < 7.0) return false;
                            } else if (ratingFilter === 'medium') {
                                if (rating < 5.0 || rating >= 7.0) return false;
                            }
                        }

                        // Apply language filter
                        if (detectedLanguages.length > 0) {
                            const movieLanguage = details.Language?.toLowerCase() || '';
                            const movieCountry = details.Country?.toLowerCase() || '';
                            
                            // Check if any detected language matches
                            const hasMatchingLanguage = detectedLanguages.some(lang => {
                                if (lang === 'tamil') return movieLanguage.includes('tamil') || movieCountry.includes('india');
                                if (lang === 'hindi') return movieLanguage.includes('hindi') || movieCountry.includes('india');
                                if (lang === 'telugu') return movieLanguage.includes('telugu') || movieCountry.includes('india');
                                if (lang === 'malayalam') return movieLanguage.includes('malayalam') || movieCountry.includes('india');
                                if (lang === 'kannada') return movieLanguage.includes('kannada') || movieCountry.includes('india');
                                if (lang === 'english') return movieLanguage.includes('english');
                                if (lang === 'spanish') return movieLanguage.includes('spanish');
                                if (lang === 'french') return movieLanguage.includes('french');
                                if (lang === 'korean') return movieLanguage.includes('korean') || movieCountry.includes('korea');
                                if (lang === 'japanese') return movieLanguage.includes('japanese') || movieCountry.includes('japan');
                                if (lang === 'chinese') return movieLanguage.includes('chinese') || movieLanguage.includes('mandarin') || movieLanguage.includes('cantonese');
                                if (lang === 'german') return movieLanguage.includes('german');
                                if (lang === 'italian') return movieLanguage.includes('italian');
                                return false;
                            });
                            
                            if (!hasMatchingLanguage) return false;
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
                                   /thriller|suspense|action|comedy|drama|horror|romantic|scary|funny|dark|intense|thrilling|netflix|amazon|prime|disney|hulu|series|korean|tamil|hindi|best|top/.test(title.toLowerCase());

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
        localStorage.setItem('preferencesCompleted', 'true');
        setPreferencesCompleted(true);
        setIsFirstTime(false);
        
        // Immediately search for movies based on user's favorite genres
        if (prefs.favoriteGenres && prefs.favoriteGenres.length > 0) {
            const searchQuery = prefs.favoriteGenres.slice(0, 2).join(' ');
            FindMovie(searchQuery);
        } else {
            FindMovie('trending movies');
        }
    }

    const openPreferences = () => {
        setIsFirstTime(false);
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
    findMovie("popular movies");
  }, []);

  return (
    <div className="app">
      <h1>Visshwa Movie App</h1>

      <div className="search">
        <input
          value={searchTerm}
          placeholder="best tamil movies"
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={e => e.key === "Enter" && findMovie(searchTerm)}
        />
        <img src={SearchIcon} onClick={() => findMovie(searchTerm)} />
      </div>

      {loading && <h2>Loading...</h2>}
      {error && <h2>{error}</h2>}

      <div className="container">
        {movies.map(m => (
          <Movie
            key={m.imdbID}
            movie={m}
            onMovieClick={() => setTrailerVideoId(m.Title)}
            onWatchOptionsClick={() => setSelectedMovie(m)}
            onSoundtrackClick={() => setSoundtrackMovie(m)}
          />
        ))}
      </div>

      <TrailerModal videoId={trailerVideoId} onClose={() => setTrailerVideoId(null)} />
      <WatchOptions movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      <MovieSoundtrack movie={soundtrackMovie} onClose={() => setSoundtrackMovie(null)} />

      {showPreferences && (
        <UserPreferences
          onSave={prefs => {
            localStorage.setItem("moviePreferences", JSON.stringify(prefs));
            localStorage.setItem("preferencesCompleted", "true");
            setShowPreferences(false);
          }}
          onClose={() => setShowPreferences(false)}
        />
      )}
    </div>
  );
}