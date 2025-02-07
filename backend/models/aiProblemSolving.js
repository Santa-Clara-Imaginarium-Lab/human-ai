import mongoose from "mongoose";

const aiProblemSolvingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  responses: [{
    questionNumber: {
      type: Number,
      required: true
    },
    selectedOption: {
      type: String,
      required: true
    }
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {versionKey: false});

export default mongoose.models.AIProblemSolving || mongoose.model("AIProblemSolving", aiProblemSolvingSchema);