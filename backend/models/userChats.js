import mongoose from "mongoose";

const userChatsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    chats: [
      {
        _id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {versionKey: false}
);

export default mongoose.models.userchats ||
  mongoose.model("userchats", userChatsSchema);


// This code sets up a user chats model for MongoDB, which stores information about all chats belonging to a user. It keeps track of:

// The user's ID.
// A list of chats for that user, where each chat has an ID, a title, and a creation date.
// The model makes it easy to store and retrieve a list of chats for each user in the database, organizing chat data effectively.