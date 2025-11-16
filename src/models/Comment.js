import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie", 
    required: true,
  },
  userId: {
    type: String,
    // ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
