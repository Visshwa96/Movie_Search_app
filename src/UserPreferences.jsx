import React, { useState } from 'react';
import './UserPreferences.css';

const UserPreferences = ({ onSave, onClose, currentPreferences }) => {
    const [preferences, setPreferences] = useState(currentPreferences || {
        favoriteGenres: [],
        favoriteDecades: [],
        preferredRating: 'all',
        favoriteActors: '',
        avoidGenres: []
    });

    const genres = [
        'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 
        'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror',
        'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller',
        'War', 'Western'
    ];

    const decades = [
        '2020s', '2010s', '2000s', '1990s', '1980s', 
        '1970s', '1960s', '1950s', 'Classic (Before 1950)'
    ];

    const ratings = [
        { value: 'all', label: 'All Ratings' },
        { value: 'high', label: 'High Rated (7+)' },
        { value: 'medium', label: 'Medium (5-7)' },
        { value: 'family', label: 'Family Friendly (G, PG)' }
    ];

    const toggleGenre = (genre) => {
        setPreferences(prev => ({
            ...prev,
            favoriteGenres: prev.favoriteGenres.includes(genre)
                ? prev.favoriteGenres.filter(g => g !== genre)
                : [...prev.favoriteGenres, genre]
        }));
    };

    const toggleAvoidGenre = (genre) => {
        setPreferences(prev => ({
            ...prev,
            avoidGenres: prev.avoidGenres.includes(genre)
                ? prev.avoidGenres.filter(g => g !== genre)
                : [...prev.avoidGenres, genre]
        }));
    };

    const toggleDecade = (decade) => {
        setPreferences(prev => ({
            ...prev,
            favoriteDecades: prev.favoriteDecades.includes(decade)
                ? prev.favoriteDecades.filter(d => d !== decade)
                : [...prev.favoriteDecades, decade]
        }));
    };

    const handleSave = () => {
        onSave(preferences);
        onClose();
    };

    const handleSkip = () => {
        onClose();
    };

    return (
        <div className="preferences-overlay">
            <div className="preferences-modal">
                <button className="preferences-close" onClick={onClose}>×</button>
                
                <div className="preferences-header">
                    <h2>🎬 Personalize Your Experience</h2>
                    <p>Help us recommend movies you'll love!</p>
                </div>

                <div className="preferences-content">
                    <div className="preference-section">
                        <h3>What genres do you love?</h3>
                        <p className="section-hint">Select all that apply</p>
                        <div className="genre-grid">
                            {genres.map(genre => (
                                <button
                                    key={genre}
                                    className={`genre-btn ${preferences.favoriteGenres.includes(genre) ? 'selected' : ''}`}
                                    onClick={() => toggleGenre(genre)}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="preference-section">
                        <h3>Any genres you prefer to avoid?</h3>
                        <p className="section-hint">Optional - we'll deprioritize these</p>
                        <div className="genre-grid">
                            {genres.map(genre => (
                                <button
                                    key={genre}
                                    className={`genre-btn avoid-btn ${preferences.avoidGenres.includes(genre) ? 'selected' : ''}`}
                                    onClick={() => toggleAvoidGenre(genre)}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="preference-section">
                        <h3>Favorite movie eras?</h3>
                        <p className="section-hint">Select your preferred decades</p>
                        <div className="decade-grid">
                            {decades.map(decade => (
                                <button
                                    key={decade}
                                    className={`decade-btn ${preferences.favoriteDecades.includes(decade) ? 'selected' : ''}`}
                                    onClick={() => toggleDecade(decade)}
                                >
                                    {decade}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="preference-section">
                        <h3>Rating preference</h3>
                        <div className="rating-options">
                            {ratings.map(rating => (
                                <label key={rating.value} className="rating-label">
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={rating.value}
                                        checked={preferences.preferredRating === rating.value}
                                        onChange={(e) => setPreferences(prev => ({
                                            ...prev,
                                            preferredRating: e.target.value
                                        }))}
                                    />
                                    <span>{rating.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="preference-section">
                        <h3>Favorite actors or directors</h3>
                        <p className="section-hint">Comma-separated (e.g., Tom Hanks, Spielberg)</p>
                        <input
                            type="text"
                            className="actors-input"
                            placeholder="Enter names..."
                            value={preferences.favoriteActors}
                            onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                favoriteActors: e.target.value
                            }))}
                        />
                    </div>
                </div>

                <div className="preferences-footer">
                    <button className="skip-btn" onClick={handleSkip}>
                        Skip for Now
                    </button>
                    <button className="save-btn" onClick={handleSave}>
                        Save Preferences
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserPreferences;
