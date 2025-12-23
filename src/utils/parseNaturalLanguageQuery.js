export function parseNaturalLanguageQuery(query) {
  const text = query.toLowerCase();

  /* ---------- MAPS ---------- */
  const genreMap = {
    action: ["action", "fight", "battle"],
    comedy: ["comedy", "funny"],
    drama: ["drama", "emotional"],
    horror: ["horror", "ghost", "scary"],
    thriller: ["thriller", "suspense"],
    romance: ["romance", "romantic", "love"]
  };

  const languageMap = {
    tamil: ["tamil", "kollywood"],
    hindi: ["hindi", "bollywood"],
    korean: ["korean", "k-drama", "kdrama"],
    english: ["english", "hollywood"]
  };

  const stopWords = [
    "movie", "movies", "film", "films",
    "best", "top", "latest", "only",
    "like", "in", "of", "above", "over", "imdb"
  ];

  /* ---------- INTENT ---------- */
  const intent = {
    detectedGenres: [],
    detectedLanguages: [],
    detectedTypes: [],
    ratingRange: null,
    titleSeeds: [],
    originalQuery: query
  };

  /* ---------- CONTENT TYPE ---------- */
  if (/series|show|tv/.test(text)) intent.detectedTypes.push("series");
  if (/movie|film/.test(text)) intent.detectedTypes.push("movie");

  /* ---------- GENRES ---------- */
  Object.entries(genreMap).forEach(([genre, words]) => {
    if (words.some(w => text.includes(w))) {
      intent.detectedGenres.push(genre);
    }
  });

  /* ---------- LANGUAGES ---------- */
  Object.entries(languageMap).forEach(([lang, words]) => {
    if (words.some(w => text.includes(w))) {
      intent.detectedLanguages.push(lang);
    }
  });

  /* ---------- RATING (KEY ADDITION) ---------- */
  // Supports: "above 8.2", "over 8.5", "8.2 imdb"
  const ratingMatch = text.match(/(?:above|over)?\s*(\d\.\d)/);
  if (ratingMatch) {
    intent.ratingRange = {
      min: parseFloat(ratingMatch[1]),
      max: 10
    };
  }

  /* ---------- TITLE SEEDS (MOST IMPORTANT) ---------- */
  text.split(/\s+/).forEach(word => {
    if (
      word.length > 2 &&
      !stopWords.includes(word) &&
      !intent.detectedGenres.includes(word) &&
      !intent.detectedLanguages.includes(word) &&
      !/^\d/.test(word)
    ) {
      intent.titleSeeds.push(word);
    }
  });

  /* ---------- FALLBACK ---------- */
  if (!intent.titleSeeds.length) {
    intent.titleSeeds.push("movie");
  }

  return intent;
}