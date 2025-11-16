import { connectDB } from "@/lib/mongodb";
import Movie from "@/models/Movie";
import { getMovieDetails, getMovieCredits } from "@/lib/tmdb";

export async function POST(req, context) {
    const params = await context.params;
    const { id } = params;

    await connectDB();

    try {
        // fetch data
        const data = await getMovieDetails(id);

        // fetch director and casting
        const { director, mainCast } = await getMovieCredits(id);

        // create movie object
        const newMovie = {
            title: data.title,
            overview: data.overview,
            genre: data.genres?.map((g) => g.name) || [],
            releaseDate: data.release_date,
            director,
            cast: mainCast,
            posterUrl: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
            tmdbId: data.id.toString(),
            averageRating: 0,
        };

        // check if it's already exists
        const exists = await Movie.findOne({ tmdbId: newMovie.tmdbId });
        if (exists) {
            return Response.json({ message: "Movie already imported" }, { status: 200 });
        }

        // save in mongoDB
        const created = await Movie.create(newMovie);
        return Response.json(created, { status: 201 });

    } catch (error) {
        console.error("Error :", error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
