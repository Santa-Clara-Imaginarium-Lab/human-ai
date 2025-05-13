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

// Allow all origins in development, or use specific origins in production
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://human-ai.netlify.app", // Netlify production
  "https://human-ai-git-main-nehasawants-projects.netlify.app", // Netlify preview
  "https://human-ai-staging.netlify.app", // Netlify staging
  "https://human-ai.up.railway.app" // Railway deployment
];

// CORS configuration for handling requests with credentials
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Check if the origin is in our allowlist
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  } else {
    // For non-allowed origins or no origin, use a more permissive approach
    res.header('Access-Control-Allow-Origin', '*');
    // Don't allow credentials for non-allowed origins
    res.header('Access-Control-Allow-Credentials', 'false');
  }
  
  // Common headers for all requests
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).send();
  }
  
  next();
});

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
  console.log(`Getting sheet: ${sheetTitle}`);
  
  try {
    // Authenticate with Google Sheets
    await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key,
    });
    
    // Load document info (minimal memory usage)
    await doc.loadInfo();
    console.log('Document info loaded');

    // Get or create the sheet
    let sheet = doc.sheetsByTitle[sheetTitle];
    if (!sheet) {
      // If sheet doesn't exist, create it with the provided headers
      sheet = await doc.addSheet({
        title: sheetTitle,
        headerValues: headerValues,
      });
      console.log(`Created new sheet: ${sheetTitle}`);
    } else {
      console.log(`Found existing sheet: ${sheetTitle}`);
      
      // Make sure we have the latest headers
      await sheet.loadHeaderRow();
      console.log(`Loaded ${sheet.headerValues?.length || 0} headers`);
    }
    
    return sheet;
  } catch (error) {
    console.error(`Error in getGoogleSheet: ${error.message}`);
    throw error;
  }
}

app.post("/api/chat-responses", async (req, res) => {
  // Send an immediate response to prevent timeout
  res.status(202).send(`Processing responses for user ${req.body.userId}`);
  
  // Process the request asynchronously
  processResponses(req.body).catch(err => {
    console.error("Error in async processing:", err);
  });
});

async function processResponses(reqBody) {
  let { userId, personality, answers } = reqBody;

  console.log("Processing responses with:");
  console.log("- userId:", userId);
  console.log("- personality:", personality);
  console.log("- answers.length:", answers?.length);

  if (!userId || !personality || !answers || !Array.isArray(answers)) {
    console.error("Missing required fields");
    return;
  }

  try {
    // Get the sheet with minimal headers
    const sheet = await getGoogleSheet("AI Personality Ques", ["User ID", "Personality"]);
    
    // Log the headers we found
    const headers = sheet.headerValues || [];
    console.log(`Found ${headers.length} headers in the sheet`);
    
    // Create a row with userId and personality
    const rowData = {
      "User ID": userId,
      "Personality": personality
    };
    
    // Add answers to the row data
    console.log(`Adding ${answers.length} answers to the row data`);
    for (let i = 0; i < answers.length; i++) {
      const columnIndex = i + 2; // Column index 2 corresponds to column C
      
      if (headers.length > columnIndex) {
        // If we have a header for this column, use it
        const headerName = headers[columnIndex];
        rowData[headerName] = answers[i];
        
        // Log every 20th header to verify we're using the right ones
        if (i % 20 === 0) {
          console.log(`Using header '${headerName}' for answer ${i}`);
        }
      } else {
        // Use a simple string key for columns without headers
        rowData[`Question ${i+1}`] = answers[i];
        
        // Log when we're using generic headers
        if (i % 20 === 0) {
          console.log(`Using generic header 'Question ${i+1}' for answer ${i}`);
        }
      }
    }
    
    // Add the new row
    console.log(`Adding new row for user ${userId}`);
    await sheet.addRow(rowData);
    console.log(`Successfully added row for user ${userId} with all answers`);
    
  } catch (error) {
    console.error("❌ Error writing answers:", error);
    console.error(error.stack);
  }
}


app.post("/api/gamescores", async (req, res) => {
    const { user_id, personality, rounds } = req.body;
    const round1 = rounds.find(round => round.round_number === 1);
    const round2 = rounds.find(round => round.round_number === 2);
    const round3 = rounds.find(round => round.round_number === 3);
    const round4 = rounds.find(round => round.round_number === 4);
    const round5 = rounds.find(round => round.round_number === 5);

    try {
      const sheet = await getGoogleSheet("Game Scores");
      await sheet.loadCells(); // Load all cells in the sheet

      // Find the first empty row starting after your data (assume starts at row 4)
      let insertRowIndex = 4; // Start searching from row 4
      while (true) {
        const cell = sheet.getCell(insertRowIndex - 1, 0); // Column A (index 0)
        if (!cell.value) break;
        insertRowIndex++;
      }
      
      // Fill cells manually
      sheet.getCell(insertRowIndex - 1, 0).value = user_id;
      sheet.getCell(insertRowIndex - 1, 1).value = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
      sheet.getCell(insertRowIndex - 1, 2).value = personality;
      if (round1) sheet.getCell(insertRowIndex - 1, 3).value = round1 ? `${round1.user_score},${round1.ai_score}` : "";
      if (round2) sheet.getCell(insertRowIndex - 1, 4).value = round2 ? `${round2.user_score},${round2.ai_score}` : "";
      if (round3) sheet.getCell(insertRowIndex - 1, 5).value = round3 ? `${round3.user_score},${round3.ai_score}` : "";
      if (round4) sheet.getCell(insertRowIndex - 1, 6).value = round4 ? `${round4.user_score},${round4.ai_score}` : "";
      if (round5) sheet.getCell(insertRowIndex - 1, 7).value = round5 ? `${round5.user_score},${round5.ai_score}` : "";
      
      await sheet.saveUpdatedCells();
      console.log("Game Scores recorded successfully");
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


app.put("/api/chats/ques/:id", async (req, res) => {
    const { question, img } = req.body;
    const currentTime = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });

    try {
        const chatDoc = await Chat.findOne({ _id: req.params.id });
        if (!chatDoc) return res.status(404).send("Chat not found");

        // Push user question to history
        chatDoc.history.push({
            role: "user",
            parts: [{ text: question, messageTimestamp: currentTime }],
            ...(img && { img }),
        });

        // === Generate AI reply here ===
        const historyText = chatDoc.history
            .filter(h => h.role === "user" || h.role === "model")
            .map(h => `${h.role === "user" ? "User" : "AI"}: ${h.parts[0].text}`)
            .join("\n");

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // or use OpenAI
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent([historyText, `User: ${question}`]);
        const aiResponse = result.response.text();

        // Save AI reply
        chatDoc.history.push({
            role: "model",
            parts: [{ text: aiResponse, messageTimestamp: currentTime }],
        });

        await chatDoc.save();
        res.status(200).send("Message appended and AI replied");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error handling message");
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

app.get("/api/chats", async (req, res) => {
  const { userId } = req.query;

  try {
    const chats = userId
      ? await Chat.find({ userId })
      : await Chat.find(); // this returns all chats

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Failed to fetch chats." });
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

app.post("/api/intent", async (req, res) => {
  try {
    const { userId, personality, rounds } = req.body;
    
    if (!userId || !personality || !rounds || !Array.isArray(rounds)) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Intent", [
      "User Id", "Timestamp", "Personality", 
      "Round 1 Decision", "Round 1 Intent",
      "Round 2 Decision", "Round 2 Intent",
      "Round 3 Decision", "Round 3 Intent",
      "Round 4 Decision", "Round 4 Intent",
      "Round 5 Decision", "Round 5 Intent"
    ]);

    const rowData = {
      "User Id": userId,
      "Timestamp": new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      "Personality": personality,
    };
    
    // Process each round's data
    rounds.forEach(round => {
      if (round.round_number >= 1 && round.round_number <= 5) {
        rowData[`Round ${round.round_number} Decision`] = round.decision || "";
        rowData[`Round ${round.round_number} Intent`] = round.intent || "";
      }
    });

    await sheet.addRow(rowData);
    console.log("Successfully stored Intent Data:", rowData);
    res.status(200).json({ success: true, message: "Intent data submitted successfully!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
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