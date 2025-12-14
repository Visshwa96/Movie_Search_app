import React from 'react';
import {useState,  useEffect} from 'react';
import SearchIcon from './Search.svg'
import Movie from './Movie.jsx'
import TrailerModal from './TrailerModal.jsx'
import './App.css'

//step 1: Define the Api url which means that the data is going to be fetched from this API
const API_URL = `https://www.omdbapi.com?apikey=${process.env.REACT_APP_OMDB_API_KEY || 'b9b8bdbc'}`;
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

export const App = () =>{
    const [movie , setMovies] = useState([]);
    const [searchTerm , setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [trailerVideoId, setTrailerVideoId] = useState(null);
    // let movie_text = document.getElementById({Search_field})
    //Movie Fetching Mechanics

    const FindMovie = async (title) =>
    {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}&s=${title}`);
            const data = await response.json();
            
            if (data.Response === "True") {
                setMovies(data.Search);
            } else {
                setMovies([]);
                setError(data.Error || 'No movies found');
            }
        } catch (err) {
            setError('Failed to fetch movies. Please try again.');
            setMovies([]);
        } finally {
            setLoading(false);
        }
    }

    const fetchTrailer = async (movieTitle) => {
        if (!YOUTUBE_API_KEY) {
            alert('YouTube API key is missing. Please add REACT_APP_YOUTUBE_API_KEY to your .env file.');
            return;
        }
        
        try {
            const response = await fetch(
                `${YOUTUBE_API_URL}?part=snippet&maxResults=1&q=${encodeURIComponent(movieTitle + ' official trailer')}&key=${YOUTUBE_API_KEY}`
            );
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                setTrailerVideoId(data.items[0].id.videoId);
            } else {
                alert('Trailer not found for this movie.');
            }
        } catch (err) {
            alert('Failed to fetch trailer. Please try again.');
        }
    }

    const handleMovieClick = (movieTitle) => {
        fetchTrailer(movieTitle);
    }

    const closeTrailer = () => {
        setTrailerVideoId(null);
    }

    useEffect(() => {
        FindMovie('superman');            
    },[])
    return(
        <div className = "app">
            <h1>Visshwa Movie App</h1>     
            <div className = "search">
                <input id = "Search_field" type = "text" value = {searchTerm} placeholder = "Search for Movies" onChange = {(e) => setSearchTerm(e.target.value)}/>
                <img src = {SearchIcon} onClick = {() => {FindMovie(searchTerm)} }/>
            </div>
            {/* step3 : dynamically change the movie page by writing a simple condition */}
            { 
                loading ? (
                    <div className = "empty">
                        <h2>Loading...</h2>
                    </div>
                ) : error ? (
                    <div className = "empty">
                        <h2>{error}</h2>
                    </div>
                ) : movie.length > 0 ? (
                    <div className = "container">
                        {movie.map((movie) => (
                            <Movie key={movie.imdbID} movie = {movie} onMovieClick={handleMovieClick}/>
                        ) ) }
                    </div>
                ) : (
                    <div className = "empty">
                        <h2>No Movies</h2>
                    </div>
                )
            }
            
            <TrailerModal videoId={trailerVideoId} onClose={closeTrailer} />
        </div>

    );

}