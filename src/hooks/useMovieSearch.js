import { useState } from "react";
import { parseNaturalLanguageQuery } from "../utils/parseNaturalLanguageQuery";
import { smartSearch } from "../utils/smartSearch";

const API_URL = `https://www.omdbapi.com?apikey=${process.env.REACT_APP_OMDB_API_KEY}`;

export function useMovieSearch() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const findMovie = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const isNLP =
        query.split(" ").length > 2 ||
        /netflix|best|series|korean|tamil/i.test(query);

      if (isNLP) {
        const parsed = parseNaturalLanguageQuery(query);
        const results = await smartSearch(parsed);
        setMovies(results);
      } else {
        const res = await fetch(`${API_URL}&s=${query}`);
        const data = await res.json();
        setMovies(data.Search || []);
      }
    } catch {
      setError("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  };

  return { movies, loading, error, findMovie };
}
