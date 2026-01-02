export function parseNaturalLanguageQuery(query) {
  const text = query.toLowerCase();

  /* ---------- MAPS ---------- */
  const genreMap = {
    action: ["action", "fight", "battle"],
    comedy: ["comedy", "funny"],
    drama: ["drama", "emotional"],
    horror: ["horror", "ghost", "scary"],
    thriller: ["thriller", "suspense"],
    romance: ["romance", "romantic", "love"],
    scifi: ["sci-fi", "science fiction"],
    fantasy: ["fantasy"],
    crime: ["crime"],
    mystery: ["mystery"]
  };

  const languageMap = {
    tamil: ["tamil", "kollywood"],
    hindi: ["hindi", "bollywood"],
    korean: ["korean", "k-drama", "kdrama"],
    english: ["english", "hollywood"],
    telugu: ["telugu", "tollywood"],
    malayalam: ["malayalam"],
    kannada: ["kannada"],
    spanish: ["spanish"],
    french: ["french"],
    japanese: ["japanese", "anime"],
    chinese: ["chinese", "mandarin"],
    german: ["german"],
    italian: ["italian"]
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
    year: null,
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

  /* ---------- YEAR DETECTION ---------- */
  const yearMatch = text.match(/\b(19\d{2}|20\d{2})\b/);
  if (yearMatch) {
    intent.year = yearMatch[1];
  }

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
      !Object.keys(languageMap).some(lang => languageMap[lang].includes(word)) &&
      !/^\d+$/.test(word)
    ) {
      intent.titleSeeds.push(word);
    }
  });

  /* ---------- FALLBACK ---------- */
  if (!intent.titleSeeds.length && intent.detectedLanguages.length > 0) {
    // For language-specific searches, use a broad term
    intent.titleSeeds.push(intent.detectedLanguages[0]);
  } else if (!intent.titleSeeds.length) {
    intent.titleSeeds.push("movie");
  }

  return intent;
}