# Movie Search App - Complete Project Context for GPT

## Project Overview
A modern React-based movie search application with Gen Z aesthetic UI, personalization features, and advanced natural language search capabilities. Built with OMDB API integration and YouTube API for trailers.

**Repository**: https://github.com/Visshwa96/Movie_Search_app.git
**Deployment**: Vercel (auto-deploys on push to master)
**Tech Stack**: React 18.3.1, vanilla CSS, OMDB API, YouTube API

---

## Complete File Structure

```
Movie_Search_app/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── App.js                    # Main application component (594 lines)
│   ├── App.css                   # Complete styling (1220+ lines)
│   ├── index.js                  # React entry point
│   ├── Movie.jsx                 # Movie card component
│   ├── TrailerModal.jsx          # YouTube trailer modal
│   ├── WatchOptions.jsx          # Where to watch modal (streaming platforms)
│   ├── MovieSoundtrack.jsx       # Soundtrack playlist modal
│   ├── UserPreferences.jsx       # Personalization modal (180 lines)
│   ├── UserPreferences.css       # Preferences styling (400+ lines)
│   └── Search.svg                # Search icon
├── package.json
├── README.md
└── .env (user must create)       # API keys
```

---

## Environment Variables (.env file)
```
REACT_APP_OMDB_API_KEY=b9b8bdbc
REACT_APP_YOUTUBE_API_KEY=[user's YouTube API key]
```

---

## Key Features Implemented

### 1. **Natural Language Search System** (MOST ADVANCED FEATURE)
**Location**: `App.js` - `parseNaturalLanguageQuery()` and `smartSearch()` functions

**Capabilities**:
- **Genre Detection**: Detects 13 genres (action, comedy, drama, horror, thriller, romance, sci-fi, fantasy, mystery, adventure, crime, animation, documentary)
- **Theme/Mood Detection**: Dark, intense, lighthearted, epic, twist, emotional, fast-paced
- **Language Detection**: 13 languages including Tamil, Hindi, Telugu, Malayalam, Kannada, English, Spanish, French, Korean, Japanese, Chinese, German, Italian
- **Specific IMDB Ratings**: 
  - "around 8.6" → searches 8.3-8.9 range
  - "8+" → searches 8.0-10.0
  - "8.5" → searches 8.3-8.7 range
- **High/Medium Rating Filters**: "high imdb" (7.0+), "decent rating" (5.0-7.0)

**Example Queries**:
- "action movie with thrilling suspense"
- "comedy romantic around 8.6 in tamil"
- "dark thriller with plot twists highly rated"
- "funny comedy 8+ in korean"

**How It Works**:
1. Parses user query to extract genres, themes, languages, ratings
2. Performs multiple parallel searches combining detected keywords
3. Fetches detailed movie info (up to 80 movies) to get IMDB ratings and languages
4. Filters by rating range and language
5. Scores movies based on relevance (genre +10, theme +5, keyword +3)
6. Sorts by rating (if filter applied) then relevance
7. Returns sorted, deduplicated results

### 2. **User Personalization System**
**Location**: `UserPreferences.jsx`, `UserPreferences.css`

**Features**:
- Genre selection (17 genres with toggle buttons)
- Avoid genres (deprioritization)
- Decade preferences (2020s through Classic pre-1950)
- Rating preferences (all, high 7+, medium 5-7, family-friendly)
- Favorite actors/directors input
- LocalStorage persistence
- Auto-show on first visit (1 second delay)

**Integration** (`App.js`):
- `sortMoviesByPreferences()` function scores movies based on user preferences
- Active preferences displayed as tags in UI
- Preferences button in header (⚙️ icon)

### 3. **Movie Modals System**
**Components**:
- **TrailerModal.jsx**: Shows YouTube trailer in embedded player
- **WatchOptions.jsx**: Displays streaming platforms (Netflix, Amazon Prime, etc.), theater booking links, IMDb links
- **MovieSoundtrack.jsx**: YouTube playlist with soundtrack songs

**Features**:
- Glassmorphism design with backdrop blur
- Responsive modals with smooth animations
- Close button with rotation animation on hover

### 4. **Gen Z Modern UI**
**Design System** (`App.css`):
- **Color Palette**:
  - Neon Pink: #ff006e
  - Neon Blue: #00f5ff
  - Neon Purple: #a855f7
  - Neon Cyan: #06ffa5
  - Dark Background: #0a0b0f
- **Typography**: Outfit (headings), Inter (body)
- **Effects**: Glassmorphism (backdrop-filter blur), gradient backgrounds, neon glow effects
- **Animations**: fadeInUp, slideUp, modalSlideIn, spinner
- **Performance Optimized**: Reduced backdrop-filter to 10px, removed fixed backgrounds, specific transition properties

### 5. **Movie Card Features**
**Location**: `Movie.jsx`

**Displays**:
- Movie poster (with placeholder fallback)
- Year
- IMDB rating (⭐ badge) - shown when available from search
- Language (🌐 badge) - shown when available
- Genre tags - shown when available
- Type (movie/series/episode)
- Title

**Interactions**:
- Click card: Opens trailer modal
- 📺 Button: Opens watch options modal
- 🎵 Button: Opens soundtrack modal
- Hover effects: Play icon overlay, button reveal, card lift

### 6. **Smart Search Detection**
**Logic** (`App.js` - `FindMovie()` function):
- Automatically detects if query is natural language (3+ words or contains genre/theme keywords)
- Routes to `smartSearch()` for NL queries
- Routes to traditional search for simple title searches
- Supports Enter key to search

---

## API Integrations

### OMDB API
**Base URL**: `https://www.omdbapi.com?apikey=b9b8bdbc`
**Endpoints Used**:
- Search: `&s={searchTerm}` - Returns array of movies
- Details: `&i={imdbID}` - Returns full movie details including rating, language, genre

### YouTube API
**Used For**:
- Trailer search: `${movieTitle} official trailer`
- Soundtrack search: `${movieTitle} soundtrack`

---

## State Management (App.js)

```javascript
const [movie, setMovies] = useState([])                    // Search results
const [searchTerm, setSearchTerm] = useState('')           // Input value
const [loading, setLoading] = useState(false)              // Loading state
const [error, setError] = useState(null)                   // Error messages
const [trailerVideoId, setTrailerVideoId] = useState(null) // Current trailer
const [selectedMovie, setSelectedMovie] = useState(null)   // For watch options
const [soundtrackMovie, setSoundtrackMovie] = useState(null) // For soundtrack
const [showPreferences, setShowPreferences] = useState(false) // Preferences modal
const [userPreferences, setUserPreferences] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem('moviePreferences');
    return saved ? JSON.parse(saved) : null;
})
```

---

## Key Functions Reference

### App.js Functions:

1. **`parseNaturalLanguageQuery(query)`**
   - Input: User's search query string
   - Output: Object with detected genres, themes, languages, rating filters
   - Purpose: NLP parser for natural language queries

2. **`smartSearch(parsedQuery)`**
   - Input: Parsed query object
   - Output: Sets movies state with filtered, sorted results
   - Purpose: Performs multi-search, fetches details, filters by rating/language

3. **`FindMovie(title)`**
   - Input: Search term
   - Output: Calls smartSearch or traditional search
   - Purpose: Router function that detects query type

4. **`sortMoviesByPreferences(movies)`**
   - Input: Array of movies
   - Output: Sorted array based on user preferences
   - Purpose: Personalizes results based on saved preferences

5. **`fetchTrailer(movieTitle)`**
   - Input: Movie title
   - Output: Sets trailerVideoId state
   - Purpose: Finds YouTube trailer

6. **`handleSavePreferences(prefs)`**
   - Input: Preferences object
   - Output: Saves to state and localStorage
   - Purpose: Persists user preferences

---

## CSS Architecture

### Performance Optimizations Applied:
- Backdrop-filter reduced from 30px to 10px (scroll performance)
- Removed `background-attachment: fixed` (scroll lag fix)
- Changed transitions from `all` to specific properties
- Removed heavy animations (glow, pulse, shine effects)
- Solid backgrounds (rgba 0.95) instead of transparent + heavy blur

### Responsive Breakpoints:
- Mobile: 600px and below
- Small Mobile: 400px and below

### Key CSS Classes:
- `.app` - Main container with gradient background
- `.search` - Glassmorphism search bar
- `.movie` - Movie card with hover effects
- `.modal-overlay` - Backdrop for all modals
- `.preferences-btn` - Header preferences button
- `.active-preferences` - Shows active preference tags
- `.pref-tag` - Individual preference badge
- `.smart-search-hint` - Helper text for NL search

---

## Git Workflow & Deployment

**Recent Commits** (most recent first):
1. `cc9fc63` - "Add specific rating ranges and language detection - supports 'around 8.6 in tamil' queries"
2. `97b0e20` - "Add IMDB rating filter to natural language search - supports 'high imdb', 'top rated' queries"
3. `4ff5cd5` - "Add natural language search - users can search with descriptions like 'action thriller with suspense'"
4. `6984df2` - "Add personalization feature with genre/decade preferences and intelligent movie sorting"
5. `fe98cd1` - "Optimize scroll performance by removing fixed backgrounds and reducing backdrop filters"
6. `c51ea67` - "Simplify hover animations and reduce GPU usage"
7. `d55258c` - "Optimize animations for better performance"

**Deployment**:
- Push to master branch auto-deploys to Vercel
- Typical deployment time: 2-3 minutes

---

## Known Issues & Limitations

1. **OMDB API Limitations**:
   - Language field not always accurate for regional Indian movies
   - Some movies don't have IMDB ratings in search results
   - Limited to 10 results per search query (hence multi-search strategy)

2. **YouTube API**:
   - Requires user's own API key (not included in repo)
   - Trailer search may not always find official trailers

3. **Natural Language Search**:
   - Tamil/Hindi movie detection relies on Language field accuracy
   - Rating filter requires fetching detailed info (slower for large result sets)
   - Limited to 80 movies for detailed fetching (performance balance)

---

## Future Enhancement Ideas

1. **Streaming Availability**: Real-time streaming platform availability (requires JustWatch API)
2. **Advanced Filters**: Actor/director search, release year range, multiple languages
3. **User Accounts**: Save watchlist, rate movies, sync across devices
4. **Recommendation Engine**: ML-based suggestions based on viewing history
5. **Voice Search**: Speech-to-text for hands-free searching
6. **Social Features**: Share movies, create collaborative watchlists
7. **Offline Mode**: Cache search results and favorites
8. **Multi-language UI**: Localization for Tamil, Hindi, etc.

---

## How to Continue Development

### Setup Instructions:
```bash
# Clone repository
git clone https://github.com/Visshwa96/Movie_Search_app.git
cd Movie_Search_app

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_OMDB_API_KEY=b9b8bdbc" > .env
echo "REACT_APP_YOUTUBE_API_KEY=YOUR_KEY" >> .env

# Start development server
npm start
```

### Common Tasks:

**Add New Genre**:
1. Update `genreMap` in `parseNaturalLanguageQuery()` (App.js line ~38)
2. Add to genre selection in `UserPreferences.jsx` (line ~60)
3. Add keywords to `genreKeywords` in `sortMoviesByPreferences()` (App.js line ~455)

**Add New Language**:
1. Update `languageMap` in `parseNaturalLanguageQuery()` (App.js line ~55)
2. Add detection logic in smartSearch filter (App.js line ~265)

**Modify UI Colors**:
1. Update CSS variables in `App.css` (`:root` section, line ~11)
2. All components use these variables

**Add New Modal**:
1. Create new component (e.g., `ReviewsModal.jsx`)
2. Import in `App.js`
3. Add state for modal visibility
4. Add handler functions (open/close)
5. Add button to `Movie.jsx`

### Testing Natural Language Search:
```javascript
// Test queries to verify functionality:
"action thriller with suspense"
"comedy romantic around 8.6 in tamil"
"dark horror highly rated"
"sci-fi 9+ in english"
"animated funny 8+ in japanese"
```

---

## Important Code Patterns

### Adding New Feature with State:
```javascript
// 1. Add state
const [newFeature, setNewFeature] = useState(false);

// 2. Add handler
const handleNewFeature = () => {
    setNewFeature(true);
};

// 3. Add to JSX
{newFeature && <NewComponent onClose={() => setNewFeature(false)} />}
```

### Making API Calls:
```javascript
const response = await fetch(`${API_URL}&parameter=${value}`);
const data = await response.json();
if (data.Response === "True") {
    // Handle success
} else {
    // Handle error
}
```

### LocalStorage Pattern:
```javascript
// Save
localStorage.setItem('key', JSON.stringify(data));

// Load with default
const [state, setState] = useState(() => {
    const saved = localStorage.getItem('key');
    return saved ? JSON.parse(saved) : defaultValue;
});
```

---

## Prompt for GPT When Continuing

**Use this prompt when starting a new session:**

"I'm working on a React movie search application with advanced features. Here's the complete context:

**Current Features**:
- Natural language search (supports queries like 'comedy romantic around 8.6 in tamil')
- Genre, theme, and language detection (13 languages including Tamil, Hindi, Telugu)
- Specific IMDB rating filters (e.g., 'around 8.6' searches 8.3-8.9)
- User personalization with localStorage persistence
- Modern Gen Z UI with glassmorphism and neon colors
- Movie modals for trailers, watch options, and soundtracks

**Tech Stack**: React 18.3.1, OMDB API, YouTube API, Vercel deployment

**File Structure**:
- App.js (594 lines) - Main component with parseNaturalLanguageQuery() and smartSearch()
- App.css (1220+ lines) - Performance-optimized styling
- Movie.jsx - Movie cards with rating/language badges
- UserPreferences.jsx - Personalization modal
- Modals: TrailerModal, WatchOptions, MovieSoundtrack

**Key Functions**:
- parseNaturalLanguageQuery(): Detects genres, themes, languages, rating ranges
- smartSearch(): Multi-search strategy with detailed fetching and filtering
- sortMoviesByPreferences(): Personalizes results based on user preferences

**Performance Optimizations**:
- Backdrop-filter reduced to 10px
- No fixed backgrounds
- Specific transition properties
- Fetches up to 80 movies for rating/language filtering

**Current Task**: [DESCRIBE YOUR NEXT TASK HERE]

Please help me [SPECIFIC REQUEST]."

---

## Contact & Repository Info

- **GitHub**: https://github.com/Visshwa96/Movie_Search_app.git
- **Branch**: master (auto-deploys to Vercel)
- **Local Path**: D:\Java Full stack Development\Movie_Search_app

---

## Last Known State

- All features working and deployed
- Natural language search with language + specific rating support fully implemented
- Movie cards show IMDB rating and language badges when available
- User preferences system with localStorage persistence
- Performance optimizations applied for smooth scrolling and animations

**Last Commit**: cc9fc63 - "Add specific rating ranges and language detection"
**Date**: December 14, 2025
