import express from "express";
import cors from "cors";
import { GoogleSpreadsheet } from "google-spreadsheet";
import mongoose from "mongoose";
import UserChats from "./models/userChats.js"
import Chat from "./models/chat.js";
import dotenv from "dotenv";
dotenv.config();

const creds = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY,
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN
};

const SHEET_ID = "16ZLSeQUycIZVQbul00eCHuk4iX6fQTMK2-l9fTVJPOU"; 
const doc = new GoogleSpreadsheet(SHEET_ID);

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

async function getGoogleSheet(sheetTitle, headerValues) {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });
  await doc.loadInfo();

  let sheet = doc.sheetsByTitle[sheetTitle];

  if (!sheet) {
    sheet = await doc.addSheet({
      title: sheetTitle,
      headerValues: headerValues,
    });
    console.log(`Created new sheet: ${sheetTitle}`);
  } else {
    const existingHeaders = sheet.headerValues || [];
    const missingHeaders = headerValues.filter(header => !existingHeaders.includes(header));

    if (missingHeaders.length > 0) {
      const updatedHeaders = [...existingHeaders, ...missingHeaders];

      await sheet.setHeaderRow(updatedHeaders);
    }
  }
  
  return sheet;
}

app.post("/api/gamescores", async (req, res) => {
    const { user_id, personality, rounds } = req.body;
    const round1 = rounds.find(round => round.round_number === 1);
    const round2 = rounds.find(round => round.round_number === 2);
    const round3 = rounds.find(round => round.round_number === 3);
    const round4 = rounds.find(round => round.round_number === 4);
    const round5 = rounds.find(round => round.round_number === 5);

    try {
      const sheet = await getGoogleSheet("Game Scores", ["User ID", "Timestamp", "Personality", "Round 1 [User Score, AI Score]", "Round 2 [User Score, AI Score]", "Round 3 [User Score, AI Score]", "Round 4 [User Score, AI Score]", "Round 5 [User Score, AI Score]"]);
      const rowData = {
        "User ID": user_id,
        "Timestamp": new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
        "Personality": personality,
        "Round 1 [User Score, AI Score]": round1 ? `${round1.user_score},${round1.ai_score}` : "",
        "Round 2 [User Score, AI Score]": round2 ? `${round2.user_score},${round2.ai_score}` : "",
        "Round 3 [User Score, AI Score]": round3 ? `${round3.user_score},${round3.ai_score}` : "",
        "Round 4 [User Score, AI Score]": round4 ? `${round4.user_score},${round4.ai_score}` : "",
        "Round 5 [User Score, AI Score]": round5 ? `${round5.user_score},${round5.ai_score}` : "",
      };
      await sheet.addRow(rowData);
      console.log("Successfully stored Game Scores Data:", rowData);
      res.status(200).send(' Game Scores recorded successfully');
    } catch (error) {
      console.error('Error writing to Google Sheets:', error);
      res.status(500).send('Error recording Game Scores');
    }
  });

  
app.post("/api/chats", async (req,res) =>{
    const {text, userId} = req.body;
    const currentTime = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
    try {
        const newChat = new Chat({
            userId: userId,
            history:[{
                role:"user",
                parts:[{
                    text,
                    messageTimestamp: currentTime
                }]
            }],
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
    const currentTime = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });

    const newItems = [
        ...(question ? [{
            role: "user",
            parts: [{
                text: question,
                messageTimestamp: currentTime
            }],
            ...(img && { img })
        }] : []),
        {
            role: "model",
            parts: [{
                text: answer,
                messageTimestamp: currentTime
            }]
        },
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

app.get("/api/chathistory", async (req, res) => {
  const { userId } = req.query;

  try {
      const chats = userId
          ? await Chat.find({ userId })
          : await Chat.find(); // return all chats if no userId

      res.status(200).json(chats);
  } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ error: "Failed to fetch chats." });
  }
});


app.post("/api/surveyresponses", async (req, res) => {
    try {
      const { userId, responses } = req.body;
  
      const extractedResponses = responses.map(response => response.selectedOption);
      
      if (!userId || !extractedResponses || !Array.isArray(extractedResponses) || extractedResponses.length === 0) {
        console.error("Invalid request format. Received:", req.body);
        return res.status(400).json({ success: false, error: "Invalid request format" });
      }
  
      const sheet = await getGoogleSheet("Post Game Survey", ["User ID", "Timestamp", "Statement 1", "Statement 2", "Statement 3", "Statement 4", "Statement 5", "Statement 6", "Statement 7", "Statement 8", "Statement 9", "Statement 10", "Statement 11", "Statement 12", "Statement 13", "Statement 14"]);
  
      const rowData = {
        "User ID": userId,
        Timestamp: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
        "Statement 1": extractedResponses[0],
        "Statement 2": extractedResponses[1],
        "Statement 3": extractedResponses[2],
        "Statement 4": extractedResponses[3],
        "Statement 5": extractedResponses[4],
        "Statement 6": extractedResponses[5],
        "Statement 7": extractedResponses[6],
        "Statement 8": extractedResponses[7],
        "Statement 9": extractedResponses[8],
        "Statement 10": extractedResponses[9],
        "Statement 11": extractedResponses[10],
        "Statement 12": extractedResponses[11],
        "Statement 13": extractedResponses[12],
        "Statement 14": extractedResponses[13],
      };
  
      await sheet.addRow(rowData);
      console.log("Successfully stored Post Game Survey Data:", rowData);
      res.status(200).json({ success: true, message: "Post Game Survey submitted!" });
  
    } catch (error) {
      console.error("Internal Server Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
});


app.post('/api/prior-experience-ai', async (req, res) => {
  const { userId, selectedOption } = req.body;

  try {
    const sheet = await getGoogleSheet("Prior Experience", ["User ID", "Timestamp", "Prior Experience", "Times Per Day"]);
    const rowData = {
      "User ID": userId,
      "Timestamp": new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      "Prior Experience": selectedOption,
    };
    await sheet.addRow(rowData);
    console.log("Successfully stored PriorExperience Data:", rowData);
    res.status(200).send('Prior Experience recorded successfully');
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    res.status(500).send('Error recording Prior Experience');
  }
});

app.put("/api/prior-experience-ai", async (req, res) => {
  const { userId, freeResponse } = req.body;

  try {
    const sheet = await getGoogleSheet("Prior Experience", ["User ID", "Timestamp", "Prior Experience", "Times Per Day"]);
    const rows = await sheet.getRows();
    const existingRows = rows.filter(row => row["User ID"] === userId);
    const latestRow = existingRows.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))[0]; 

    if (latestRow) {
      latestRow["Times Per Day"] = freeResponse;
      await latestRow.save();
      console.log("PriorExperience updated successfully. Times Per Day: ", freeResponse);
      res.status(200).json({ success: true, message: "Times Per Day updated successfully." });
    } else {
        console.error("No existing row found for userId:", userId);
        res.status(404).json({ success: false, error: "No existing row found for userId." });
    }
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    res.status(500).send('Error recording Prior Experience');
  }
});

app.post("/api/ailiteracy", async (req, res) => {
  try {
    const { userId, responses } = req.body;

    const extractedResponses = responses.map(response => response.selectedOption);
    
    if (!userId || !extractedResponses || !Array.isArray(extractedResponses) || extractedResponses.length === 0) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("AI Literacy", ["User ID", "Timestamp", "Statement 1", "Statement 2", "Statement 3", "Statement 4", "Statement 5", "Statement 6", "Statement 7", "Statement 8"]);

    const rowData = {
      "User ID": userId,
      Timestamp: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      "Statement 1": extractedResponses[0],
      "Statement 2": extractedResponses[1],
      "Statement 3": extractedResponses[2],
      "Statement 4": extractedResponses[3]
    };

    await sheet.addRow(rowData);
    console.log("Successfully stored AI Literacy Data:", rowData);
    res.status(200).json({ success: true, message: "AI Literacy Survey submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/api/ailiteracy", async (req, res) => {
  const { userId, responses } = req.body;
  const extractedResponses = responses.map(response => response.selectedOption);

  try {
    const sheet = await getGoogleSheet("AI Literacy", ["User ID", "Timestamp", "Statement 1", "Statement 2", "Statement 3", "Statement 4", "Statement 5", "Statement 6", "Statement 7", "Statement 8"]);
    const rows = await sheet.getRows();
    const existingRows = rows.filter(row => row["User ID"] === userId);
    const latestRow = existingRows.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))[0]; 

    if (latestRow) {
      latestRow["Statement 5"] = extractedResponses[0];
      latestRow["Statement 6"] = extractedResponses[1];
      latestRow["Statement 7"] = extractedResponses[2];
      latestRow["Statement 8"] = extractedResponses[3];
      await latestRow.save();
      console.log("AI Literacy updated successfully.", responses);
      res.status(200).json({ success: true, message: "AI Literacy updated successfully." });
    } else {
        console.error("No existing row found for userId:", userId);
        res.status(404).json({ success: false, error: "No existing row found for userId." });
    }
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    res.status(500).send('Error recording AI Literacy');
  }
});

app.post("/api/aiproblemsolving", async (req, res) => {
  try {
    const { userId, responses } = req.body;

    const extractedResponses = responses.map(response => response.selectedOption);
    
    if (!userId || !extractedResponses || !Array.isArray(extractedResponses) || extractedResponses.length === 0) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("AI Problem Solving", ["User ID", "Timestamp", "Statement 1", "Statement 2", "Statement 3"]);

    const rowData = {
      "User ID": userId,
      Timestamp: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      "Statement 1": extractedResponses[0],
      "Statement 2": extractedResponses[1],
      "Statement 3": extractedResponses[2]
    };

    await sheet.addRow(rowData);
    console.log("Successfully stored AI Problem Solving Data:", rowData);
    res.status(200).json({ success: true, message: "AI Problem Solving Survey submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/aiselfcompetency", async (req, res) => {
  try {
    const { userId, responses } = req.body;

    const extractedResponses = responses.map(response => response.selectedOption);
    
    if (!userId || !extractedResponses || !Array.isArray(extractedResponses) || extractedResponses.length === 0) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("AI Self Competency", ["User ID", "Timestamp", "Statement 1", "Statement 2", "Statement 3"]);

    const rowData = {
      "User ID": userId,
      Timestamp: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      "Statement 1": extractedResponses[0],
      "Statement 2": extractedResponses[1],
      "Statement 3": extractedResponses[2]
    };

    await sheet.addRow(rowData);
    console.log("Successfully stored AI Self Competency Data:", rowData);
    res.status(200).json({ success: true, message: "AI Self Competency Survey submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/trustscaleexplainableai", async (req, res) => {
  try {
    const { userId, responses } = req.body;

    const extractedResponses = responses.map(response => response.selectedOption);
    
    if (!userId || !extractedResponses || !Array.isArray(extractedResponses) || extractedResponses.length === 0) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Trust Scale Explainable AI", ["User ID", "Timestamp", "Statement 1", "Statement 2", "Statement 3", "Statement 4", "Statement 5", "Statement 6", "Statement 7"]);

    const rowData = {
      "User ID": userId,
      Timestamp: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      "Statement 1": extractedResponses[0],
      "Statement 2": extractedResponses[1],
      "Statement 3": extractedResponses[2],
      "Statement 4": extractedResponses[3]
    };

    await sheet.addRow(rowData);
    console.log("Successfully stored Trust Scale Explainable AI Data:", rowData);
    res.status(200).json({ success: true, message: "Trust Scale Explainable AI Survey submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/api/trustscaleexplainableai", async (req, res) => {
  const { userId, responses } = req.body;
  const extractedResponses = responses.map(response => response.selectedOption);

  try {
    const sheet = await getGoogleSheet("Trust Scale Explainable AI", ["User ID", "Timestamp", "Statement 1", "Statement 2", "Statement 3", "Statement 4", "Statement 5", "Statement 6", "Statement 7"]);
    const rows = await sheet.getRows();
    const existingRows = rows.filter(row => row["User ID"] === userId);
    const latestRow = existingRows.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))[0]; 

    if (latestRow) {
      latestRow["Statement 5"] = extractedResponses[0];
      latestRow["Statement 6"] = extractedResponses[1];
      latestRow["Statement 7"] = extractedResponses[2];
      await latestRow.save();
      console.log("Trust Scale Explainable AI updated successfully.", responses);
      res.status(200).json({ success: true, message: "Trust Scale Explainable AI updated successfully." });
    } else {
        console.error("No existing row found for userId:", userId);
        res.status(404).json({ success: false, error: "No existing row found for userId." });
    }
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    res.status(500).send('Error recording Trust Scale Explainable AI');
  }
});

app.post("/api/trustpeopleautomation", async (req, res) => {
  try {
    const { userId, responses } = req.body;

    const extractedResponses = responses.map(response => response.selectedOption);
    
    if (!userId || !extractedResponses || !Array.isArray(extractedResponses) || extractedResponses.length === 0) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Trust People Automation", ["User ID", "Timestamp", "Statement 1", "Statement 2", "Statement 3", "Statement 4", "Statement 5", "Statement 6", "Statement 7", "Statement 8", "Statement 9", "Statement 10"]);

    const rowData = {
      "User ID": userId,
      Timestamp: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      "Statement 1": extractedResponses[0],
      "Statement 2": extractedResponses[1],
      "Statement 3": extractedResponses[2],
      "Statement 4": extractedResponses[3],
      "Statement 5": extractedResponses[4]
    };

    await sheet.addRow(rowData);
    console.log("Successfully stored Trust People Automation Data:", rowData);
    res.status(200).json({ success: true, message: "Trust People Automation Survey submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/api/trustpeopleautomation", async (req, res) => {
  const { userId, responses } = req.body;
  const extractedResponses = responses.map(response => response.selectedOption);

  try {
    const sheet = await getGoogleSheet("Trust People Automation", ["User ID", "Timestamp", "Statement 1", "Statement 2", "Statement 3", "Statement 4", "Statement 5", "Statement 6", "Statement 7", "Statement 8", "Statement 9", "Statement 10"]);
    const rows = await sheet.getRows();
    const existingRows = rows.filter(row => row["User ID"] === userId);
    const latestRow = existingRows.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))[0]; 

    if (latestRow) {
      latestRow["Statement 6"] = extractedResponses[0];
      latestRow["Statement 7"] = extractedResponses[1];
      latestRow["Statement 8"] = extractedResponses[2];
      latestRow["Statement 9"] = extractedResponses[3];
      latestRow["Statement 10"] = extractedResponses[4];
      await latestRow.save();
      console.log("Trust People Automation updated successfully.", responses);
      res.status(200).json({ success: true, message: "Trust People Automation updated successfully." });
    } else {
        console.error("No existing row found for userId:", userId);
        res.status(404).json({ success: false, error: "No existing row found for userId." });
    }
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    res.status(500).send('Error recording Trust People Automation');
  }
});

app.post("/api/demographics", async (req, res) => {
    const { userId, gender} = req.body;

    try {
      const sheet = await getGoogleSheet("Demographics", ["User ID", "Timestamp", "Gender", "Transgender Info", "Age", "Ethnicity"]);
      const rowData = {
        "User ID": userId,
        "Timestamp": new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
        "Gender": gender,
      };
      await sheet.addRow(rowData);
      console.log("Successfully stored Demographics Data:", rowData);
      res.status(200).send(' Demographics recorded successfully');
    } catch (error) {
      console.error('Error writing to Google Sheets:', error);
      res.status(500).send('Error recording Demographics');
    }
});

app.put("/api/demographics", async (req, res) => {
  const { userId, transgenderInfo, age, ethnicity } = req.body;

  try {
    const sheet = await getGoogleSheet("Demographics", ["User ID", "Timestamp", "Gender", "Transgender Info", "Age", "Ethnicity"]);
    const rows = await sheet.getRows();
    const existingRows = rows.filter(row => row["User ID"] === userId);
    const latestRow = existingRows.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))[0]; 

    if (latestRow) {
      if (transgenderInfo !== undefined) {
        latestRow["Transgender Info"] = transgenderInfo;
      }
      if (age !== undefined) {
        latestRow["Age"] = age;
      }
      if (ethnicity !== undefined) {
        latestRow["Ethnicity"] = ethnicity.join(", "); 
      }
      await latestRow.save();
      console.log("Demographics updated successfully.");
      res.status(200).json({ success: true, message: "Demographics updated successfully." });
    } else {
        console.error("No existing row found for userId:", userId);
        res.status(404).json({ success: false, error: "No existing row found for userId." });
    }
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    res.status(500).send('Error recording Demographics');
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

    const extractedResponses = responses.map(response => response.responseText);
    
    if (!userId || !extractedResponses || !Array.isArray(extractedResponses) || extractedResponses.length === 0) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Post Game Free Response", ["User ID", "Timestamp", "Question 1", "Question 2", "Question 3", "Question 4", "Question 5", "Question 6", "Question 7", "Question 8"]);

    const rowData = {
      "User ID": userId,
      Timestamp: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      "Question 1": extractedResponses[0],
      "Question 2": extractedResponses[1],
      "Question 3": extractedResponses[2],
      "Question 4": extractedResponses[3],
      "Question 5": extractedResponses[4],
      "Question 6": extractedResponses[5],
      "Question 7": extractedResponses[6],
      "Question 8": extractedResponses[7]
    };

    await sheet.addRow(rowData);
    console.log("Successfully stored Free Response Data:", rowData);
    res.status(200).json({ success: true, message: "Free Response Survey submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/postarchetypefreeresponse", async (req, res) => {
  try {
    const { userId, response } = req.body;
    
    if (!userId || response.length === 0) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Post Archetype Free Response", ["User ID", "Timestamp", "Question 1"]);

    const rowData = {
      "User ID": userId,
      Timestamp: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      "Question 1": response,
    };

    await sheet.addRow(rowData);
    console.log("Successfully stored Archetype Free Response Data:", rowData);
    res.status(200).json({ success: true, message: "Free Response Survey submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/daily-code', async (req, res) => {
  const { generatedCode } = req.body;

  try {
    const sheet = await getGoogleSheet("Daily Codes", ["Date", "Generated Code"]);

    const todayPDT = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
    const [month, day, year] = todayPDT.split(",")[0].split("/");
    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`; // Convert MM/DD/YYYY to YYYY-MM-DD

    const rowData = {
      "Date": `${formattedDate}`, 
      "Generated Code": generatedCode,
    };

    await sheet.addRow(rowData);

    console.log("Successfully stored Daily Code:", rowData);
    res.status(200).send('Daily Code recorded successfully');
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    res.status(500).send('Error recording Daily Code');
  }
});



app.get('/api/daily-code', async (req, res) => {
  try {
    const sheet = await getGoogleSheet("Daily Codes", ["Date", "Generated Code"]);
    const rows = await sheet.getRows();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No Daily Code found' });
    }

    const todayPDT = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
    const [month, day, year] = todayPDT.split(",")[0].split("/");
    const todayString = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    const todayRow = rows.find(row => row["Date"] === todayString);

    if (!todayRow) {
      return res.status(404).json({ error: 'No code found for today' });
    }

    res.status(200).json({ code: todayRow["Generated Code"] });

  } catch (error) {
    console.error('Error reading from Google Sheets:', error);
    res.status(500).json({ error: 'Error retrieving Daily Code' });
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