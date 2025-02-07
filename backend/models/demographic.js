import mongoose from "mongoose";

const demographicSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  transgenderInfo: {
    type: String,
    required: false
  },
  age: {
    type: Number,
    required: false
  },
  ethnicity: {
    type: [String], // Array to allow multiple values
    required: false
  }
}, {versionKey: false});

export default mongoose.models.Demographic || mongoose.model("Demographic", demographicSchema); 