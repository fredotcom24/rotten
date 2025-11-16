import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

//get a movie by name
export const searchMovie = async(query) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                query,
                language: "en-US"
            }
        });
        return response.data.results;
    } catch (error) {
        console.error("Error :", error.message);
        throw error;
    }
};

// get a movie details
export const getMovieDetails = async(tmdbId) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}`, {
            params: {
                api_key: TMDB_API_KEY,
                language: "en-US"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error :", error.message);
        throw error;
    }
};

//get a movie director and casting
export const getMovieCredits = async(tmdbId) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}/credits`, {
            params: {
                api_key: TMDB_API_KEY,
                language: "en-US"
            }
        });

        const { crew, cast } = response.data;

        // find director
        const director = crew.find((person) => person.job === "Director")?.name || "Unknown";

        // find  five main casting
        const mainCast = cast.slice(0, 5).map((actor) => actor.name);

        return { director, mainCast };

    } catch (error) {
        console.error("Error :", error.message);
        throw error;
    }
};
