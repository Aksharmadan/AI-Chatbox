// server.js – FREE local AI using Ollama (no API key, no money)

const express = require("express");
const path = require("path");

const app = express();
// Use a port that won't conflict
const PORT = 4321;

console.log("✅ USING LOCAL OLLAMA AI (completely free)");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serves index.html, script.js, etc.

// Health route
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
});

// MAIN CHAT ENDPOINT
app.post("/api/chat", async(req, res) => {
    try {
        const { message } = req.body || {};

        if (!message || typeof message !== "string") {
            return res.status(400).json({ reply: "Please send a text message." });
        }

        const cleanMessage = message.trim();
        if (!cleanMessage) {
            return res.status(400).json({ reply: "Message cannot be empty." });
        }

        console.log("User:", cleanMessage);

        // 🔥 Call local Ollama instead of any paid API
        const ollamaRes = await fetch("http://localhost:11434/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "mistral", // you pulled this model with `ollama pull mistral`
                messages: [{
                        role: "system",
                        content: "You are a helpful AI assistant inside a website chatbot. " +
                            "Answer questions clearly and helpfully.",
                    },
                    { role: "user", content: cleanMessage },
                ],
                stream: false,
            }),
        });

        if (!ollamaRes.ok) {
            const text = await ollamaRes.text();
            console.error("Ollama error:", ollamaRes.status, text);
            return res.json({
                reply: "⚠️ Local AI error. Make sure Ollama is running and the model exists (run `ollama pull mistral`).",
            });
        }

        const data = await ollamaRes.json();

        // Ollama /api/chat returns { message: { role, content } }
        let reply =
            data &&
            data.message &&
            typeof data.message.content === "string" ?
            data.message.content.trim() :
            null;

        if (!reply) reply = "I couldn't think of a reply right now. Try again.";

        console.log("Bot:", reply);
        res.json({ reply });
    } catch (err) {
        console.error("Server error in /api/chat:", err);
        res.json({
            reply: "⚠️ I couldn't reach the local AI. Is Ollama running? Try `ollama pull mistral` and then `ollama run mistral` once.",
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Chatbot server running at http://localhost:${PORT}`);
});