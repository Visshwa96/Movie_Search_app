// src/utils/smartSearch.js
const API_URL = `https://www.omdbapi.com?apikey=${process.env.REACT_APP_OMDB_API_KEY || "b9b8bdbc"}`;

/**
 * Smart search using NLP intent
 * - Multi-seed OMDb search
 * - Relevance scoring
 * - Language / genre / type / rating filters
 * - Hybrid final ranking
 */
export async function smartSearch(parsedQuery = {}) {
  const {
    detectedGenres = [],
    themes = [],
    keywords = [],
    detectedLanguages = [],
    detectedPlatforms = [],
    detectedTypes = [],
    ratingFilter = null,
    ratingRange = null,
    originalQuery = "",
    excludeKeywords = []
  } = parsedQuery;

  const movieMap = new Map();

  /* ---------------- SEARCH TERMS ---------------- */
  const searchTerms = [];

  // Strongest signals first
  keywords.slice(0, 3).forEach(k => searchTerms.push(k));
  detectedGenres.forEach(g => searchTerms.push(g));
  detectedPlatforms.forEach(p => searchTerms.push(p));

  if (!searchTerms.length) {
    searchTerms.push(originalQuery || "movie");
  }

  /* ---------------- FETCH SEARCH RESULTS ---------------- */
  const responses = await Promise.all(
    searchTerms.map(term =>
      fetch(`${API_URL}&s=${encodeURIComponent(term)}`)
        .then(r => r.json())
        .catch(() => null)
    )
  );

  responses.forEach(res => {
    if (res?.Response === "True" && Array.isArray(res.Search)) {
      res.Search.forEach(movie => {
        if (movieMap.has(movie.imdbID)) return;

        const title = movie.Title.toLowerCase();
        let relevanceScore = 0;

        /* ---------------- RELEVANCE SCORING ---------------- */

        // Keyword match (strong)
        keywords.forEach(k => {
          if (title.includes(k)) relevanceScore += 4;
        });

        // Genre match
        detectedGenres.forEach(g => {
          if (title.includes(g)) relevanceScore += 6;
        });

        // Theme match (lighter weight)
        themes.forEach(t => {
          if (title.includes(t)) relevanceScore += 2;
        });

        // Platform hint
        detectedPlatforms.forEach(p => {
          if (title.includes(p)) relevanceScore += 3;
        });

        // Type match (movie / series)
        if (
          detectedTypes.length &&
          detectedTypes.includes(movie.Type?.toLowerCase())
        ) {
          relevanceScore += 5;
        }

        movieMap.set(movie.imdbID, {
          ...movie,
          relevanceScore
        });
      });
    }
  });

  let movies = Array.from(movieMap.values());

  /* ---------------- EXCLUDE KEYWORDS ---------------- */
  if (excludeKeywords.length) {
    movies = movies.filter(m =>
      !excludeKeywords.some(ex =>
        m.Title.toLowerCase().includes(ex)
      )
    );
  }

  /* ---------------- FETCH DETAILS (IMDB / LANGUAGE) ---------------- */
  const detailedResults = await Promise.all(
    movies.slice(0, 50).map(m =>
      fetch(`${API_URL}&i=${m.imdbID}`)
        .then(r => r.json())
        .catch(() => null)
    )
  );

  movies = detailedResults
    .filter(d => d && d.Response === "True")
    .map(d => ({
      imdbID: d.imdbID,
      Title: d.Title,
      Year: d.Year,
      Type: d.Type,
      Poster: d.Poster,
      imdbRating: parseFloat(d.imdbRating) || 0,
      Genre: d.Genre || "",
      Language: d.Language || "",
      Country: d.Country || "",
      relevanceScore: movieMap.get(d.imdbID)?.relevanceScore || 0
    }));

  /* ---------------- LANGUAGE FILTER ---------------- */
  if (detectedLanguages.length) {
    movies = movies.filter(m =>
      detectedLanguages.some(lang =>
        m.Language.toLowerCase().includes(lang) ||
        (lang === "tamil" && m.Country.toLowerCase().includes("india")) ||
        (lang === "korean" && m.Country.toLowerCase().includes("korea"))
      )
    );
  }

  /* ---------------- RATING FILTER ---------------- */
  if (ratingRange) {
    movies = movies.filter(
      m =>
        m.imdbRating >= ratingRange.min &&
        (!ratingRange.max || m.imdbRating <= ratingRange.max)
    );
  }

  // Mild boost for “high” rating intent
  if (ratingFilter === "high") {
    movies.forEach(m => {
      if (m.imdbRating >= 7.5) m.relevanceScore += 2;
    });
  }

  /* ---------------- FINAL SORT (HYBRID) ---------------- */
  movies.sort((a, b) => {
    const scoreA = a.relevanceScore * 2 + a.imdbRating;
    const scoreB = b.relevanceScore * 2 + b.imdbRating;
    return scoreB - scoreA;
  });

  return movies;
}
