import React from 'react';
import {useState,  useEffect} from 'react';
import SearchIcon from './Search.svg'
import Movie from './Movie.jsx'
import './App.css'

//step 1: Define the Api url which means that the data is going to be fetched from this API
const API_URL = `https://www.omdbapi.com?apikey=${process.env.REACT_APP_OMDB_API_KEY || 'b9b8bdbc'}`;

export const App = () =>{
    const [movie , setMovies] = useState([]);
    const [searchTerm , setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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
                            <Movie key={movie.imdbID} movie = {movie}/>
                        ) ) }
                    </div>
                ) : (
                    <div className = "empty">
                        <h2>No Movies</h2>
                    </div>
                )
            }
            
        </div>

    );

}