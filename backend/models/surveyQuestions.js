import mongoose from "mongoose";

const surveyQuestionsSchema = new mongoose.Schema({
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
      required: true,
      enum: ['Strongly Disagree', 'Somewhat Disagree', 'Neutral', 'Somewhat Agree', 'Strongly Agree']
    }
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.SurveyResponse || mongoose.model("SurveyResponse", surveyQuestionsSchema);