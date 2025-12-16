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

  const [showPreferences, setShowPreferences] = useState(
    !localStorage.getItem("preferencesCompleted")
  );

  /* ---------------- SEARCH HANDLER ---------------- */
  const findMovie = async (query) => {
    if (!query?.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const isNaturalLanguage =
        query.split(" ").length > 2 ||
        /best|top|netflix|tamil|hindi|korean|series|movie/i.test(query);

      if (isNaturalLanguage) {
        const parsed = parseNaturalLanguageQuery(query);
        const results = await smartSearch(parsed);
        setMovies(results);
      } else {
        const res = await fetch(`${API_URL}&s=${encodeURIComponent(query)}`);
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

  /* ---------------- INITIAL LOAD ---------------- */
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
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && findMovie(searchTerm)}
        />
        <img src={SearchIcon} alt="search" onClick={() => findMovie(searchTerm)} />
      </div>

      {loading && <h2>Loading...</h2>}
      {error && <h2>{error}</h2>}

      <div className="container">
        {movies.map((m) => (
          <Movie
            key={m.imdbID}
            movie={m}
            onMovieClick={() => fetchTrailer(m.Title)}
            onWatchOptionsClick={() => setSelectedMovie(m)}
            onSoundtrackClick={() => setSoundtrackMovie(m)}
          />
        ))}
      </div>

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

      {showPreferences && (
        <UserPreferences
          onSave={(prefs) => {
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