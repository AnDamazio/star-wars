import React, { useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState("");
  const [error, setError] = useState(null);

  const loadAnimation = useEffect(() => {
    const timer = setInterval(() => {
      if (isLoading && loadingProgress.length < 3) {
        setLoadingProgress((prev) => prev.concat("."));
      }

      if (isLoading && loadingProgress.length === 3) {
        setLoadingProgress("");
      }

      if (!isLoading) {
        setLoadingProgress("");
      }
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [loadingProgress, isLoading]);

  async function fetchMoviesHandler() {
    setIsLoading(true);
    try {
      const response = await fetch("https://swapi.dev/api/films");
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && <p>Found no movies.</p>}
        {!isLoading && error && error}
        {isLoading && <p>Loading {loadingProgress}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
