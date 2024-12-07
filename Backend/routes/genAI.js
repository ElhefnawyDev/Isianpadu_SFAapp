import express from "express";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import authenticateToken from "../middleware/auth.js";
const genAI = new GoogleGenerativeAI("AIzaSyDEfH8GKodh8hSXEUM17CS9kH1wgFMlRoc");

const gemini = express.Router();
gemini.use(express.json());

gemini.use(bodyParser.json());

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Initialize chat with empty history
const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Your name is Haji AbdulRazak, one of the members of the sales team at isianpadu, your job is to assist the sales team in there daily tasks and answer there questions",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Okay, I'm ready to assist the isianpadu sales team.  Ask me anything!  I can help with a variety of tasks, ",
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: "whenevre some one ask you about your name or who are you, you have to say that your name is Nova and you are a memeber of the sales team at isianpadu company",
        },
      ],
    },
  ],

  generationConfig: {
    maxOutputTokens: 500,
  },
});

gemini.post("/ask", authenticateToken, async (req, res) => {
  const { question } = req.body;

  // if (!question) {
  //   return res.status(400).json({ error: "Question is required" });
  // }
  if (!question || question.trim() === "") {
    return res
      .status(400)
      .json({ error: "Question is required and cannot be empty" });
  }

  try {
    const result = await chat.sendMessage(question);
    const response = await result.response;
    const text = await response.text();
    res.json({ result: text });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default gemini;
