import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import UserChats from "./models/userChats.js"
import Chat from "./models/chat.js";
import GameScore from "./models/gameScores.js";
import SurveyResponse from "./models/surveyQuestions.js";
import PriorExperienceAI from "./models/PriorExperienceAI.js";
import AILiteracy from "./models/ailiteracy.js";
import aiProblemSolving from "./models/aiProblemSolving.js";
import aiSelfCompetency from "./models/aiSelfCompetency.js";
import trustScaleExplainableAI from "./models/trustScaleExplainableAI";
import trustPeopleAutomation from "./models/trustPeopleAutomation";
import demographic from "./models/demographic.js";
import postGameFreeResponse from "./models/postGameFreeResponse.js";
import dotenv from "dotenv";
dotenv.config();

const port = 3000;
const app = express();

const allowedOrigins = [
  "http://localhost:5173", // Allow local development
  "https://human-ai.netlify.app" // Allow Netlify production site
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy does not allow this origin!"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

const connect = async () => {
  try{
      await mongoose.connect(process.env.MONGO)
      console.log("Connected to MongoDB")
  }catch(err){
      console.log(err)
  }
}

app.post("/api/gamescores", async (req, res) => {
    const { user_id, personality, rounds } = req.body;
  
    // Ensure all required fields are present
    if (!user_id || !personality || !rounds || !Array.isArray(rounds)) {
      return res.status(400).json({ error: "Invalid data." });
    }
  
    try {
      const newGameScore = new GameScore({
        user_id,
        personality,
        rounds,
      });
  
      await newGameScore.save();
      res.status(201).json({ message: "Game scores saved successfully!" });
    } catch (error) {
      console.error("Error saving game scores:", error);
      res.status(500).json({ error: "Failed to save game scores." });
    }
  });

  app.get("/api/gamescores/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const gameScores = await GameScore.find({ user_id: userId });
  
      if (!gameScores.length) {
        return res.status(404).json({ error: "No game scores found for this user." });
      }
  
      res.status(200).json(gameScores);
    } catch (error) {
      console.error("Error fetching game scores:", error);
      res.status(500).json({ error: "Failed to fetch game scores." });
    }
  });
  
app.post("/api/chats", async (req,res) =>{
    const {text, userId} = req.body
    try {
        const newChat = new Chat({
            userId: userId,
            history:[{role:"user", parts:[{text}]}],
        });

        const savedChat = await newChat.save();

        const userChats = await UserChats.find({userId: userId});
        if(!userChats.length){
            const newUserChats = new UserChats({
                userId: userId,
                chats: [
                    {
                        _id: savedChat._id,
                        title: text.substring(0,40),
                    },
                ],
            });
            await newUserChats.save();
        }else{
            await UserChats.updateOne({userId: userId},{
                $push:{
                    chats:{
                        _id: savedChat._id,
                        title: text.substring(0,40),
                    },
                },
            });
        }
        res.status(201).send(savedChat._id);
    } catch (err) {
        console.log(err)
        res.status(500).send("Error creating chat!")
    }
});

app.get("/api/userchats", async (req, res) => {
    const { userId } = req.query;
    
    try {
        const userChats = await UserChats.find({ userId });
        if (!userChats || userChats.length === 0) {
            return res.status(200).send([]);
        }
        res.status(200).send(userChats[0].chats);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching userchats!");
    }
});

app.get("/api/chats/:id", async (req, res) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.id });
        res.status(200).send(chat);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching chat!");
    }
});

app.put("/api/chats/:id", async (req, res) => {
    const { question, answer, img } = req.body;

    const newItems = [
        ...(question ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }] : []),
        { role: "model", parts: [{ text: answer }] },
    ];

    try {
        const updatedChat = await Chat.updateOne(
            { _id: req.params.id },
            {
                $push: {
                    history: {
                        $each: newItems,
                    },
                },
            }
        );
        res.status(200).send(updatedChat);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding conversation!");
    }
});

app.post("/api/surveyresponses", async (req, res) => {
  try {
    const { userId, responses } = req.body;
    
    const surveyResponse = new SurveyResponse({
      userId,
      responses
    });
    
    await surveyResponse.save();
    res.status(201).json({ message: "Survey responses saved successfully!" });
  } catch (error) {
    console.error("Error saving survey responses:", error);
    res.status(500).json({ error: "Failed to save survey responses." });
  }
});

app.post("/api/prior-experience-ai", async (req, res) => {
  try {
    const { userId, selectedOption } = req.body;

    // Ensure required fields are present
    if (!userId || !selectedOption) {
      return res.status(400).json({ error: "userId and selectedOption are required." });
    }

    const priorExperienceAI = new PriorExperienceAI({
      userId,
      selectedOption,
    });

    await priorExperienceAI.save();
    res.status(201).json({ message: "Prior experience data saved successfully!" });
  } catch (error) {
    console.error("Error saving prior experience data:", error);
    res.status(500).json({ error: "Failed to save prior experience data." });
  }
});

app.put("/api/prior-experience-ai", async (req, res) => {
  const { userId, freeResponse } = req.body;

  // Ensure required fields are present
  if (!userId) {
    return res.status(400).json({ error: "userId is required." });
  }

  try {
    const updatedEntry = await PriorExperienceAI.findOneAndUpdate(
      { userId }, // Find the entry by userId
      { freeResponse }, // Update the freeResponse field
      { new: true } // Return the updated document
    );

    if (!updatedEntry) {
      return res.status(404).json({ error: "No entry found for this userId." });
    }

    res.status(200).json({ message: "Prior experience data updated successfully!", updatedEntry });
  } catch (error) {
    console.error("Error updating prior experience data:", error);
    res.status(500).json({ error: "Failed to update prior experience data." });
  }
});

app.post("/api/ailiteracy", async (req, res) => {
  try {
    const { userId, responses } = req.body;

    const aiLiteracyResponse = new AILiteracy({
      userId,
      responses
    });

    await aiLiteracyResponse.save();
    res.status(201).json({ message: "AI Literacy responses saved successfully!" });
  } catch (error) {
    console.error("Error saving AI Literacy responses:", error);
    res.status(500).json({ error: "Failed to save AI Literacy responses." });
  }
});

app.put("/api/ailiteracy", async (req, res) => {
  const { userId, responses } = req.body;

  // Ensure required fields are present
  if (!userId || !responses) {
    return res.status(400).json({ error: "userId and responses are required." });
  }

  try {
    // Find the existing entry by userId
    const existingEntry = await AILiteracy.findOne({ userId });

    if (!existingEntry) {
      return res.status(404).json({ error: "No entry found for this userId." });
    }

    // Append new responses to the existing responses array
    existingEntry.responses.push(...responses); // Directly append the new responses
    await existingEntry.save(); // Save the updated entry

    res.status(200).json({ message: "AI Literacy responses updated successfully!" });
  } catch (error) {
    console.error("Error updating AI Literacy responses:", error);
    res.status(500).json({ error: "Failed to update AI Literacy responses." });
  }
});

app.post("/api/aiproblemsolving", async (req, res) => {
  try {
    const { userId, responses } = req.body;

    const aiProblemSolvingResponse = new aiProblemSolving({
      userId,
      responses
    });

    await aiProblemSolvingResponse.save();
    res.status(201).json({ message: "AI Problem Solving responses saved successfully!" });
  } catch (error) {
    console.error("Error saving AI Problem Solving responses:", error);
    res.status(500).json({ error: "Failed to save AI Problem Solving responses." });
  }
});

app.post("/api/aiselfcompetency", async (req, res) => {
  try {
    const { userId, responses } = req.body;

    const aiSelfCompetencyResponse = new aiSelfCompetency({
      userId,
      responses
    });

    await aiSelfCompetencyResponse.save();
    res.status(201).json({ message: "AI Self Competency responses saved successfully!" });
  } catch (error) {
    console.error("Error saving AI Self Competency responses:", error);
    res.status(500).json({ error: "Failed to save AI Self Competency responses." });
  }
});

app.post("/api/trustscaleexplainableai", async (req, res) => {
  try {
    const { userId, responses } = req.body;

    const trustScaleExplainableAIResponse = new trustScaleExplainableAI({
      userId,
      responses
    });

    await trustScaleExplainableAIResponse.save();
    res.status(201).json({ message: "Trust Scale for Explainable AI responses saved successfully!" });
  } catch (error) {
    console.error("Error saving Trust Scale for Explainable AI responses:", error);
    res.status(500).json({ error: "Failed to save Trust Scale for Explainable AI responses." });
  }
});

app.put("/api/trustscaleexplainableai", async (req, res) => {
  const { userId, responses } = req.body;

  // Ensure required fields are present
  if (!userId || !responses) {
    return res.status(400).json({ error: "userId and responses are required." });
  }

  try {
    // Find the existing entry by userId
    const existingEntry = await trustScaleExplainableAI.findOne({ userId });

    if (!existingEntry) {
      return res.status(404).json({ error: "No entry found for this userId." });
    }

    // Append new responses to the existing responses array
    existingEntry.responses.push(...responses); // Directly append the new responses
    await existingEntry.save(); // Save the updated entry

    res.status(200).json({ message: "Trust Scale for Explainable AI responses updated successfully!" });
  } catch (error) {
    console.error("Error updating Trust Scale for Explainable AI responses:", error);
    res.status(500).json({ error: "Failed to update Trust Scale for Explainable AI responses." });
  }
});

app.post("/api/trustpeopleautomation", async (req, res) => {
  try {
    const { userId, responses } = req.body;

    const trustPeopleAutomationResponse = new trustPeopleAutomation({
      userId,
      responses
    });

    await trustPeopleAutomationResponse.save();
    res.status(201).json({ message: "Trust between People and Automation responses saved successfully!" });
  } catch (error) {
    console.error("Error saving Trust between People and Automation responses:", error);
    res.status(500).json({ error: "Failed to save Trust between People and Automation responses." });
  }
});

app.put("/api/trustpeopleautomation", async (req, res) => {
  const { userId, responses } = req.body;

  // Ensure required fields are present
  if (!userId || !responses) {
    return res.status(400).json({ error: "userId and responses are required." });
  }

  try {
    // Find the existing entry by userId
    const existingEntry = await trustPeopleAutomation.findOne({ userId });

    if (!existingEntry) {
      return res.status(404).json({ error: "No entry found for this userId." });
    }

    // Append new responses to the existing responses array
    existingEntry.responses.push(...responses); // Directly append the new responses
    await existingEntry.save(); // Save the updated entry

    res.status(200).json({ message: "Trust between People and Automation responses updated successfully!" });
  } catch (error) {
    console.error("Error updating Trust between People and Automation responses:", error);
    res.status(500).json({ error: "Failed to update Trust between People and Automation responses." });
  }
});

app.post("/api/demographics", async (req, res) => {
  try {
    const { userId, gender, transgenderInfo, age, ethnicity } = req.body;

    const newDemographic = new demographic({
      userId,
      gender,
      transgenderInfo,
      age,
      ethnicity
    });

    await newDemographic.save();
    res.status(201).json(newDemographic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/demographics", async (req, res) => {
  const { userId, transgenderInfo, age, ethnicity } = req.body;

  // Ensure required fields are present
  if (!userId) {
    return res.status(400).json({ error: "userId is required." });
  }

  try {
    // Find the existing demographic entry by userId
    const existingDemographic = await demographic.findOne({ userId });

    if (!existingDemographic) {
      return res.status(404).json({ error: "No demographic entry found for this userId." });
    }

    // Update the fields if provided
    if (transgenderInfo !== undefined) {
      existingDemographic.transgenderInfo = transgenderInfo;
    }
    if (age !== undefined) {
      existingDemographic.age = age;
    }
    if (ethnicity !== undefined) {
      existingDemographic.ethnicity = ethnicity;
    }

    // Save the updated entry
    await existingDemographic.save();

    res.status(200).json({ message: "Demographic data updated successfully!", updatedEntry: existingDemographic });
  } catch (error) {
    console.error("Error updating demographic data:", error);
    res.status(500).json({ error: "Failed to update demographic data." });
  }
});

app.get("/api/chats", async (req, res) => {
    const { userId } = req.query;

    try {
        const chats = await Chat.find({ userId });
        res.status(200).json(chats);
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({ error: "Failed to fetch chats." });
    }
});

app.post("/api/postgamefreeresponse", async (req, res) => {
  try {
    const { userId, responses } = req.body;

    // Validate userId and responses array
    if (!userId || !responses || !Array.isArray(responses)) {
      return res.status(400).json({ error: "Invalid request format" });
    }

    // Validate that we have exactly 7 responses and none are empty
    if (responses.length !== 7 || responses.some(r => !r.responseText || !r.responseText.trim())) {
      return res.status(400).json({ error: "All 7 responses are required and must not be empty" });
    }

    const newResponse = new postGameFreeResponse({
      userId,
      responses: responses.map(r => ({
        ...r,
        responseText: r.responseText.trim()
      }))
    });

    await newResponse.save();
    res.status(201).json({ message: "Post-game responses saved successfully!" });
  } catch (error) {
    console.error("Error saving post-game responses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(401).send('Unauthenticated!')
})

app.listen(port, () =>{
  connect()
  console.log("Backend server running on 3000");
});