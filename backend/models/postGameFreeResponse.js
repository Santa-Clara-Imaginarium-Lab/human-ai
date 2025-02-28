import mongoose from "mongoose";

const postGameFreeResponseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  responses: [{
    questionNumber: {
      type: Number,
      required: true
    },
    responseText: {
      type: String,
      required: true
    }
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false });

export default mongoose.models.PostGameFreeResponse || mongoose.model("PostGameFreeResponse", postGameFreeResponseSchema);
