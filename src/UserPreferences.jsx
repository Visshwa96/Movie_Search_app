import React, { useState } from 'react';
import './UserPreferences.css';

const UserPreferences = ({ onSave, onClose, currentPreferences, isFirstTime = true }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [preferences, setPreferences] = useState(currentPreferences || {
        favoriteGenres: [],
        favoriteDecades: [],
        preferredRating: 'all',
        favoriteActors: '',
        avoidGenres: []
    });

    const totalSteps = 4;

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

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSave = () => {
        onSave(preferences);
        if (onClose) {
            onClose();
        }
    };

    const canProceed = () => {
        if (currentStep === 1) return preferences.favoriteGenres.length > 0;
        return true; // Other steps are optional
    };

    const renderStep = () => {
        switch(currentStep) {
            case 1:
                return (
                    <div className="preference-section step-content">
                        <h3>What genres do you love? 🎭</h3>
                        <p className="section-hint">Select at least one genre to continue</p>
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
                );
            
            case 2:
                return (
                    <div className="preference-section step-content">
                        <h3>Favorite movie eras? 📅</h3>
                        <p className="section-hint">Select your preferred decades (optional)</p>
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
                );
            
            case 3:
                return (
                    <div className="preference-section step-content">
                        <h3>Rating preference ⭐</h3>
                        <p className="section-hint">What kind of ratings do you prefer?</p>
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
                        
                        <div style={{ marginTop: '30px' }}>
                            <h3>Any genres to avoid? 🚫</h3>
                            <p className="section-hint">Optional - we'll deprioritize these</p>
                            <div className="genre-grid">
                                {genres.slice(0, 10).map(genre => (
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
                    </div>
                );
            
            case 4:
                return (
                    <div className="preference-section step-content">
                        <h3>Favorite actors or directors 🎬</h3>
                        <p className="section-hint">Optional - Comma-separated names</p>
                        <input
                            type="text"
                            className="actors-input"
                            placeholder="e.g., Tom Hanks, Christopher Nolan, Meryl Streep"
                            value={preferences.favoriteActors}
                            onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                favoriteActors: e.target.value
                            }))}
                        />
                        
                        <div className="summary-section">
                            <h3 style={{ marginTop: '40px' }}>Your Preferences Summary 📋</h3>
                            <div className="summary-content">
                                <p><strong>Favorite Genres:</strong> {preferences.favoriteGenres.join(', ') || 'None selected'}</p>
                                {preferences.favoriteDecades.length > 0 && (
                                    <p><strong>Favorite Eras:</strong> {preferences.favoriteDecades.join(', ')}</p>
                                )}
                                <p><strong>Rating Preference:</strong> {ratings.find(r => r.value === preferences.preferredRating)?.label}</p>
                                {preferences.avoidGenres.length > 0 && (
                                    <p><strong>Avoid:</strong> {preferences.avoidGenres.join(', ')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            
            default:
                return null;
        }
    };

    return (
        <div className="preferences-overlay">
            <div className="preferences-modal">
                {!isFirstTime && onClose && <button className="preferences-close" onClick={onClose}>×</button>}
                
                <div className="preferences-header">
                    <h2>🎬 {isFirstTime ? 'Welcome! Set Up Your Preferences' : 'Update Your Preferences'}</h2>
                    <p>{isFirstTime ? 'Answer a few questions to personalize your experience' : 'Modify your movie preferences'}</p>
                    <div className="step-indicator">
                        {[1, 2, 3, 4].map(step => (
                            <div 
                                key={step} 
                                className={`step-dot ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
                            >
                                {currentStep > step ? '✓' : step}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="preferences-content">
                    {renderStep()}
                </div>

                <div className="preferences-footer">
                    {currentStep > 1 && (
                        <button className="back-btn" onClick={handleBack}>
                            ← Back
                        </button>
                    )}
                    
                    <div style={{ flex: 1 }}></div>
                    
                    {currentStep < totalSteps ? (
                        <button 
                            className="next-btn" 
                            onClick={handleNext}
                            disabled={!canProceed()}
                        >
                            Next →
                        </button>
                    ) : (
                        <button className="save-btn" onClick={handleSave}>
                            {isFirstTime ? 'Start Searching 🚀' : 'Save Changes'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserPreferences;
