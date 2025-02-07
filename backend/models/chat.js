import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    history: [
      {
        role: {
          type: String,
          enum: ["user", "model"],
          required: true,
        },
        parts: [
          {
            text: {
              type: String,
              required: true,
            },
          },
        ],
        img: {
          type: String,
          required: false,
        },
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now
    }
  }, {versionKey: false}
);

export default mongoose.models.chat || mongoose.model("chat", chatSchema);

// This code defines a chat model for MongoDB using Mongoose. It describes how the chat data should be structured, with 
// fields for the user ID, the player ID, the chat history (with messages that have text and optional images), and timestamps for record-keeping. 
// The model is used to store and retrieve chat data in a MongoDB database.
