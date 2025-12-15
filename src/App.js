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

      const intent = parseNaturalLanguageQuery(query);
      const result = await smartSearch(intent);
      setMovies(result);
    } catch (e) {
      setError("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  };

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