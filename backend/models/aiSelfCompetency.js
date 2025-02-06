import mongoose from "mongoose";

const aiSelfCompetencySchema = new mongoose.Schema({
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
});

export default mongoose.models.AISelfCompetency || mongoose.model("AISelfCompetency", aiSelfCompetencySchema);