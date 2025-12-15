export function parseNaturalLanguageQuery(query) {
  const text = query.toLowerCase();

  const genreMap = {
    action: ["action", "fight", "battle"],
    comedy: ["comedy", "funny"],
    drama: ["drama"],
    horror: ["horror", "ghost", "scary"],
    thriller: ["thriller", "suspense"],
    romance: ["romance", "romantic", "love"],
  };

  const languageMap = {
    tamil: ["tamil", "kollywood"],
    hindi: ["hindi", "bollywood"],
    korean: ["korean", "k-drama"],
    english: ["english", "hollywood"],
  };

  const stopWords = [
    "movie",
    "movies",
    "film",
    "films",
    "best",
    "top",
    "latest",
    "only",
    "like",
    "in",
    "of",
  ];

  const intent = {
    titleSeeds: [],
    genres: [],
    languages: [],
    year: null,
    quality: null,
    type: null,
    originalQuery: query,
  };

  // Content type
  if (/series|show|tv/.test(text)) intent.type = "series";
  if (/movie|film/.test(text)) intent.type = "movie";

  // Quality
  if (/best|top/.test(text)) intent.quality = "high";
  if (/latest|new/.test(text)) intent.quality = "latest";

  // Year
  const yearMatch = text.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) intent.year = parseInt(yearMatch[0], 10);

  // Genres
  Object.entries(genreMap).forEach(([g, words]) => {
    if (words.some(w => text.includes(w))) intent.genres.push(g);
  });

  // Languages
  Object.entries(languageMap).forEach(([l, words]) => {
    if (words.some(w => text.includes(w))) intent.languages.push(l);
  });

  // Title seeds (MOST IMPORTANT)
  text.split(" ").forEach(word => {
    if (
      word.length > 2 &&
      !stopWords.includes(word) &&
      !intent.genres.includes(word) &&
      !intent.languages.includes(word)
    ) {
      intent.titleSeeds.push(word);
    }
  });

  // Fallback seed
  if (!intent.titleSeeds.length) {
    intent.titleSeeds.push("movie");
  }

  return intent;
}