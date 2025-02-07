import mongoose from "mongoose";

const gameScoreSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    personality: {
      type: String,
      enum: ["reserved", "role_model", "self_centered", "average", "control"],
      required: true,
    },
    rounds: [
      {
        round_number: {
          type: Number,
          required: true,
        },
        user_score: {
          type: Number,
          required: true,
        },
        ai_score: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }, {versionKey: false}
);

export default mongoose.models.GameScore || mongoose.model("GameScore", gameScoreSchema);
