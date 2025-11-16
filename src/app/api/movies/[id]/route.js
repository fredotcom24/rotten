import { connectDB } from "@/lib/mongodb";
import Movie from "@/models/Movie";

export const dynamic = "force-dynamic";

//get a movie
export async function GET(req, context) {
    const params = await context.params;
    await connectDB();
    const movie = await Movie.findById(params.id);
    if (!movie) return Response.json({ message: "Movie not found" }, { status: 404 });
    return Response.json(movie);
}

// update a movie
export async function PUT(req, context) {
    const params = await context.params;
    await connectDB();
    const data = await req.json();
    const updated = await Movie.findByIdAndUpdate(params.id, data, { new: true });
    if (!updated) return Response.json({ message: "Movie not found" }, { status: 404 });
    return Response.json(updated);
}

// delete a movie
export async function DELETE(req, context) {
    const params = await context.params;
    await connectDB();
    const deleted = await Movie.findByIdAndDelete(params.id);
    if (!deleted) {
        return Response.json({ message: "Movie not found" }, { status: 404 });
    }
    return Response.json({ message: "Movie deleted successfully" }, { status: 200 });
}