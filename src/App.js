import React, { useState, useEffect } from "react";
import SearchIcon from "./Search.svg";

import Movie from "./components/Movie";
import TrailerModal from "./components/TrailerModal";
import WatchOptions from "./components/WatchOptions";
import MovieSoundtrack from "./components/MovieSoundtrack";
import UserPreferences from "./components/UserPreferences";
import Favorites from "./components/Favorites";
import MovieDetails from "./components/MovieDetails";

import { parseNaturalLanguageQuery } from "./utils/parseNaturalLanguageQuery";
import { smartSearch } from "./utils/smartSearch";

import "./App.css";

const API_URL = `https://www.omdbapi.com?apikey=${process.env.REACT_APP_OMDB_API_KEY}`;
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [trailerVideoId, setTrailerVideoId] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [soundtrackMovie, setSoundtrackMovie] = useState(null);
  const [detailsMovie, setDetailsMovie] = useState(null);

  const [showPreferences, setShowPreferences] = useState(
    !localStorage.getItem("preferencesCompleted")
  );
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("movieFavorites") || "[]")
  );
  const [userPreferences, setUserPreferences] = useState(
    JSON.parse(localStorage.getItem("moviePreferences") || "null")
  );

  /* ---------------- FAVORITES MANAGEMENT ---------------- */
  const toggleFavorite = (movie) => {
    const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.imdbID !== movie.imdbID);
    } else {
      updatedFavorites = [...favorites, movie];
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem("movieFavorites", JSON.stringify(updatedFavorites));
  };

  const removeFavorite = (imdbID) => {
    const updatedFavorites = favorites.filter(fav => fav.imdbID !== imdbID);
    setFavorites(updatedFavorites);
    localStorage.setItem("movieFavorites", JSON.stringify(updatedFavorites));
  };

  const isFavorite = (imdbID) => {
    return favorites.some(fav => fav.imdbID === imdbID);
  };

  /* ---------------- SEARCH HANDLER ---------------- */
  const findMovie = async (query) => {
    if (!query?.trim()) return;

    // Check if preferences are completed
    if (!localStorage.getItem("preferencesCompleted")) {
      setShowPreferences(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check for natural language patterns including language keywords
      const isNaturalLanguage =
        query.split(" ").length > 2 ||
        /best|top|latest|popular|netflix|tamil|hindi|korean|telugu|malayalam|kannada|japanese|spanish|french|bollywood|kollywood|series|movie|thriller|action|comedy|drama|romance/i.test(query);

      if (isNaturalLanguage) {
        const parsed = parseNaturalLanguageQuery(query);
        const results = await smartSearch(parsed);
        setMovies(results);
      } else {
        // Simple search - extract year if present
        const yearMatch = query.match(/\b(19\d{2}|20\d{2})\b/);
        const year = yearMatch ? yearMatch[1] : null;
        const searchTerm = year ? query.replace(year, "").trim() : query;

        let apiUrl = `${API_URL}&s=${encodeURIComponent(searchTerm)}`;
        if (year) {
          apiUrl += `&y=${year}`;
        }

        const res = await fetch(apiUrl);
        const data = await res.json();

        if (data.Response === "True") {
          setMovies(data.Search);
        } else {
          setMovies([]);
          setError(data.Error || "No movies found");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch movies");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- TRAILER ---------------- */
  const fetchTrailer = async (title) => {
    if (!YOUTUBE_API_KEY) {
      alert("YouTube API key missing");
      return;
    }

    try {
      const res = await fetch(
        `${YOUTUBE_API_URL}?part=snippet&maxResults=1&q=${encodeURIComponent(
          title + " official trailer"
        )}&key=${YOUTUBE_API_KEY}`
      );
      const data = await res.json();
      setTrailerVideoId(data.items?.[0]?.id?.videoId || null);
    } catch {
      alert("Failed to load trailer");
    }
  };

  /* ---------------- MOVIE DETAILS ---------------- */
  const fetchMovieDetails = async (movie) => {
    try {
      const res = await fetch(`${API_URL}&i=${movie.imdbID}&plot=full`);
      const data = await res.json();
      
      if (data.Response === "True") {
        setDetailsMovie(data);
      } else {
        setDetailsMovie(movie);
      }
    } catch (err) {
      console.error("Failed to fetch movie details:", err);
      setDetailsMovie(movie);
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    // Only load movies if preferences are completed
    if (localStorage.getItem("preferencesCompleted")) {
      findMovie("popular movies");
    }
  }, []);

  return (
    <div className="app">
      <h1>Visshwa Movie App</h1>
      
      <div className="header-buttons">
        <button 
          className="favorites-btn" 
          onClick={() => setShowFavorites(true)}
          title="My Favorites"
        >
          ❤️ Favorites ({favorites.length})
        </button>
        <button 
          className="preferences-btn" 
          onClick={() => setShowPreferences(true)}
          title="Settings"
        >
          ⚙️ Preferences
        </button>
      </div>

      {userPreferences && (
        <div className="active-preferences">
          <span className="pref-label">Active Preferences:</span>
          {userPreferences.favoriteGenres?.slice(0, 3).map(genre => (
            <span key={genre} className="pref-tag">{genre}</span>
          ))}
          {userPreferences.favoriteGenres?.length > 3 && (
            <span className="pref-tag">+{userPreferences.favoriteGenres.length - 3} more</span>
          )}
        </div>
      )}

      <div className="search">
        <input
          value={searchTerm}
          placeholder="best tamil movies 2025, korean thriller, bollywood action..."
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && findMovie(searchTerm)}
        />
        <img src={SearchIcon} alt="search" onClick={() => findMovie(searchTerm)} />
      </div>

      {loading && <div className="loading-container"><h2>Loading...</h2></div>}
      {error && <div className="error-container"><h2>{error}</h2></div>}

      {!localStorage.getItem("preferencesCompleted") && !showPreferences ? (
        <div className="welcome-message">
          <h2>🎬 Welcome to Visshwa Movie App!</h2>
          <p>Please set up your preferences to start discovering amazing movies.</p>
          <button 
            className="setup-btn" 
            onClick={() => setShowPreferences(true)}
          >
            Set Up Preferences 🚀
          </button>
        </div>
      ) : (
        <div className="container">
          {movies.map((m) => (
            <Movie
              key={m.imdbID}
              movie={m}
              onMovieClick={() => fetchTrailer(m.Title)}
              onWatchOptionsClick={() => setSelectedMovie(m)}
              onSoundtrackClick={() => setSoundtrackMovie(m)}
              onFavoriteClick={() => toggleFavorite(m)}
              onDetailsClick={() => fetchMovieDetails(m)}
              isFavorite={isFavorite(m.imdbID)}
            />
          ))}
        </div>
      )}

      <TrailerModal
        videoId={trailerVideoId}
        onClose={() => setTrailerVideoId(null)}
      />
      <WatchOptions
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
      <MovieSoundtrack
        movie={soundtrackMovie}
        onClose={() => setSoundtrackMovie(null)}
      />

      {detailsMovie && (
        <MovieDetails
          movie={detailsMovie}
          onClose={() => setDetailsMovie(null)}
        />
      )}

      {showPreferences && (
        <UserPreferences
          currentPreferences={userPreferences}
          isFirstTime={!localStorage.getItem("preferencesCompleted")}
          onSave={(prefs) => {
            localStorage.setItem("moviePreferences", JSON.stringify(prefs));
            localStorage.setItem("preferencesCompleted", "true");
            setUserPreferences(prefs);
            setShowPreferences(false);
            // Load initial movies after preferences are set
            if (!localStorage.getItem("preferencesCompleted")) {
              findMovie("popular movies");
            }
          }}
          onClose={() => {
            // Don't allow closing if it's the first time
            if (localStorage.getItem("preferencesCompleted")) {
              setShowPreferences(false);
            }
          }}
        />
      )}

      {showFavorites && (
        <Favorites
          favorites={favorites}
          onClose={() => setShowFavorites(false)}
          onRemoveFavorite={removeFavorite}
          onMovieClick={(movie) => {
            setShowFavorites(false);
            fetchTrailer(movie.Title);
          }}
        />
      )}
    </div>
  );
}