import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    overview: String,
    genre: [String],
    releaseDate: String,
    director: String,
    cast: [String],
    posterUrl: String,
    tmdbId: String,
    averageRating: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Movie || mongoose.model("Movie", MovieSchema);