import { searchMovie } from "@/lib/tmdb";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
        return Response.json({ error: "Params 'query' missed" }, { status: 400 });
    }

    try {
        const results = await searchMovie(query);
        return Response.json(results);
    } catch (error) {
        return Response.json({ error: "Error TMDB" }, { status: 500 });
    }
}