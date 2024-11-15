import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import UserChats from "./models/userChats.js"
import Chat from "./models/chat.js";


const port = 3000;
const app = express();

app.use(cors({
  origin:process.env.CLIENT_URL,
  credentials: true,
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


app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(401).send('Unauthenticated!')
})

app.listen(port, () =>{
  connect()
  console.log("Backend server running on 3000");
});