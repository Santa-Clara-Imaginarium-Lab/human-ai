import mongoose from "mongoose";

const priorExperienceAISchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  selectedOption: {
    type: String,
    required: true,
    enum: ['Yes', 'No']
  },
  freeResponse: {
    type: String,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {versionKey: false});

export default mongoose.models.PriorExperience || mongoose.model("PriorExperience", priorExperienceAISchema);