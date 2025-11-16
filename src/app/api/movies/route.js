import { connectDB } from "@/lib/mongodb";
import Movie from "@/models/Movie";

//Get movies list
export async function GET() {
    await connectDB();
    const movies = await Movie.find();
    return Response.json(movies);
}

// add a movie in atabase
export async function POST(req) {
    await connectDB();
    const data = await req.json();
    const movie = await Movie.create(data);
    return Response.json(movie, { status: 201 });
}