import React from 'react';
import {useState,  useEffect} from 'react';
import SearchIcon from './Search.svg'
import Movie from './Movie.jsx'
import './App.css'
// /b9b8bdbc
//step 1: Define the Api url which means that the data is going to be fetched from this API
const API_URL = "http://www.omdbapi.com?apikey=b9b8bdbc";

export const App = () =>{
    const [movie , setMovies] = useState([]);
    const [searchTerm , setSearchTerm] = useState('');
    // let movie_text = document.getElementById({Search_field})
    //Movie Fetching Mechanics

    const FindMovie = async (title) =>
    {
            const response = await fetch(`${API_URL}&s=${title}`);
            const data = await response.json();
            setMovies(data.Search);
            console.log(data.Search);
    }

    useEffect(() => {
        FindMovie('superman');            
    },[])
    return(
        <div className = "app">
            <h1>Visshwa Movie App</h1>     
            <div className = "search">
                <input id = "Search_field" type = "text" value = {searchTerm} placeholder = "Search for Movies" onChange = {(e) => setSearchTerm(e.target.value)}/>
                <img src = {SearchIcon} onClick = {() => {FindMovie(searchTerm)} }X/>
            </div>
            {/* step3 : dynamically change the movie page by writing a simple condition */}
            { 
                
                (
                    movie.length>0 ?
                    (
                        <div className = "container">
                            {movie.map((movie) => (
                                <Movie movie = {movie}/>
                            ) ) }
                        </div>
                    ):
                    (
                        <div className = "empty">
                        <h2>No Movies</h2>
                        </div>
                    )
                
                )
            }
            
        </div>

    );

}