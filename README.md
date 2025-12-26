# 🚀 Aurora AI — Smart Website Chatbot

Aurora AI is a **modern, full-stack AI chatbot** designed to be embedded into any website.  
It provides real-time conversational assistance, explains products or services, answers FAQs, and enhances user engagement through a beautiful floating chat widget.

Built with a **production-style architecture**, Aurora AI supports both **local AI (Ollama)** for development and **cloud AI APIs** for global deployment.

## ✨ Features

- 🤖 AI-powered conversational chatbot  
- 💬 Beautiful floating chat widget (glassmorphism UI)  
- ⏳ Typing indicators & smooth animations  
- 🌗 Dark / Light theme toggle with persistence  
- ⚡ Real-time responses  
- 🧠 Local AI support using Ollama (free, no API cost)  
- 🌍 Production-ready cloud deployment support  
- 🧩 Modular, scalable backend architecture  

## 🏗️ Tech Stack

### Frontend
- HTML5  
- CSS3 (Modern UI + animations)  
- Vanilla JavaScript  

### Backend
- Node.js  
- Express.js  

### AI Engine
- **Local (Development):** Ollama + Mistral  
- **Production:** OpenAI / Gemini (configurable)

## 📂 Project Structure

ai-chatbot/
├── public/
│ ├── index.html
│ ├── style.css
│ └── script.js
│
├── server.js
├── package.json
├── .env
└── node_modules/


## ⚙️ Local Setup (Development)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/aksharmadan/aurora-ai-chatbot.git
cd aurora-ai-chatbot

2️⃣ Install dependencies
npm install

3️⃣ Install & start Ollama (Local AI)

Download Ollama from 👉 https://ollama.com

Start Ollama server:

ollama serve

Pull AI model:

ollama pull mistral
(Optional test)

ollama run mistral

4️⃣ Start the backend server
node server.js

You should see:
Chatbot server running at http://localhost:4321


