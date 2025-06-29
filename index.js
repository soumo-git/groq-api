import express from "express";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ HARDCODED Groq API Key
const GROQ_API_KEY = "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";

app.post("/groq", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing 'message' in body." });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "You're an AI assistant who gives psychological but subtle prompts when a user marks a task complete. Be indirect yet emotionally intelligent.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response?.data?.choices?.[0]?.message?.content;
    console.log("🧠 Groq Reply:", reply); // 🔍 Debug log for Render

    if (reply) {
      res.status(200).json({ reply });
    } else {
      console.error("⚠️ Groq API returned no valid reply", response.data);
      res.status(500).json({ error: "AI didn't respond. Try again later." });
    }

  } catch (err) {
    console.error("🔥 Groq Error:", err.response?.data || err.message);
    res.status(500).json({ error: "AI didn't respond. Try again later." });
  }
});

app.get("/", (req, res) => {
  res.send("Groq AI API is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});