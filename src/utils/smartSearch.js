// utils/smartSearch.js

const API_URL = `https://www.omdbapi.com?apikey=${process.env.REACT_APP_OMDB_API_KEY}`;

export async function smartSearch(intent) {
  const {
    titleSeeds = [],
    genres = [],
    languages = [],
    year,
    quality,
    type,
    originalQuery,
  } = intent;

  const movieMap = new Map();

  // Search ONLY with title seeds
  const searchTerms = titleSeeds.slice(0, 3);

  const responses = await Promise.all(
    searchTerms.map(term =>
      fetch(`${API_URL}&s=${encodeURIComponent(term)}`)
        .then(r => r.json())
        .catch(() => null)
    )
  );

  responses.forEach(res => {
    if (res?.Response === "True") {
      res.Search.forEach(m => {
        if (!movieMap.has(m.imdbID)) {
          movieMap.set(m.imdbID, m);
        }
      });
    }
  });

  let movies = Array.from(movieMap.values());

  // Fetch details for filtering
  const detailed = await Promise.all(
    movies.slice(0, 40).map(m =>
      fetch(`${API_URL}&i=${m.imdbID}`)
        .then(r => r.json())
        .catch(() => null)
    )
  );

  movies = detailed.filter(d => {
    if (!d || d.Response === "False") return false;

    if (type && d.Type !== type) return false;

    if (year && parseInt(d.Year) !== year) return false;

    if (languages.length) {
      const lang = d.Language?.toLowerCase() || "";
      if (!languages.some(l => lang.includes(l))) return false;
    }

    if (genres.length) {
      const g = d.Genre?.toLowerCase() || "";
      if (!genres.some(gen => g.includes(gen))) return false;
    }

    return true;
  });

  // Ranking
  if (quality === "high") {
    movies.sort(
      (a, b) =>
        parseFloat(b.imdbRating || 0) - parseFloat(a.imdbRating || 0)
    );
  }

  return movies;
}