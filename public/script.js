const chatLauncher = document.getElementById("chat-launcher");
const chatbot = document.getElementById("chatbot");
const chatClose = document.getElementById("chat-close");
const chatBody = document.getElementById("chat-body");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const themeToggle = document.getElementById("theme-toggle");
const clearChatBtn = document.getElementById("clear-chat");
const suggestionsBar = document.getElementById("chat-suggestions");

// We can store conversation if you ever want to send it to a database later.
const conversation = [];

// --- THEME HANDLING ---
(function initTheme() {
    const storedTheme = localStorage.getItem("chat-theme");
    if (storedTheme === "light") {
        document.body.classList.add("light");
    }
})();

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light");
        const theme = document.body.classList.contains("light") ? "light" : "dark";
        localStorage.setItem("chat-theme", theme);
    });
}

// --- UTILITIES ---
function getTimeString() {
    const d = new Date();
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    const suffix = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${suffix}`;
}

function appendMessage(text, sender = "bot", showTime = true) {
    const row = document.createElement("div");
    row.classList.add("message-row", sender);

    const bubble = document.createElement("div");
    bubble.classList.add("message-bubble");
    bubble.textContent = text;

    row.appendChild(bubble);

    if (showTime) {
        const meta = document.createElement("div");
        meta.classList.add("message-meta");
        meta.textContent =
            sender === "user" ?
            `You · ${getTimeString()}` :
            `Aurora Bot · ${getTimeString()}`;
        row.appendChild(meta);
    }

    chatBody.appendChild(row);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Save to in-memory conversation log
    conversation.push({
        sender,
        text,
        timestamp: new Date().toISOString()
    });
}

function appendTypingIndicator() {
    const row = document.createElement("div");
    row.classList.add("message-row", "bot");
    row.dataset.typing = "true";

    const bubble = document.createElement("div");
    bubble.classList.add("message-bubble");

    const wrap = document.createElement("div");
    wrap.classList.add("typing-indicator");
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement("div");
        dot.classList.add("typing-dot");
        wrap.appendChild(dot);
    }
    bubble.appendChild(wrap);
    row.appendChild(bubble);

    chatBody.appendChild(row);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTypingIndicator() {
    const typingRow = chatBody.querySelector('[data-typing="true"]');
    if (typingRow) typingRow.remove();
}

// --- INITIAL WELCOME MESSAGE ---
function showWelcomeMessage() {
    chatBody.innerHTML = "";
    appendMessage(
        "Hey, I’m Aurora – your personal project guide. Ask me about this chatbot, the tech stack, or anything fun like a joke! ✨",
        "bot"
    );
}

// Check backend health once when chat opens
async function checkHealthOnce() {
    try {
        const res = await fetch("/health");
        if (!res.ok) throw new Error();
        const data = await res.json();
        console.log("Health:", data);
    } catch {
        appendMessage(
            "Heads up: I couldn't reach the backend health endpoint. The chat may be offline.",
            "bot"
        );
    }
}

// --- OPEN / CLOSE ---
chatLauncher.addEventListener("click", () => {
    const isHidden =
        chatbot.style.display === "none" || chatbot.style.display === "";
    chatbot.style.display = isHidden ? "flex" : "none";

    if (isHidden) {
        showWelcomeMessage();
        userInput.focus();
        checkHealthOnce();
    }
});

chatClose.addEventListener("click", () => {
    chatbot.style.display = "none";
});

// Clear chat
clearChatBtn.addEventListener("click", () => {
    conversation.length = 0;
    showWelcomeMessage();
});

// Suggestions (quick replies)
if (suggestionsBar) {
    suggestionsBar.addEventListener("click", (e) => {
        if (e.target.matches("button[data-text]")) {
            const text = e.target.getAttribute("data-text");
            sendMessage(text);
        }
    });
}

// --- FORM SUBMIT / FETCH LOGIC ---
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;
    sendMessage(text);
});

async function sendMessage(text) {
    appendMessage(text, "user");
    userInput.value = "";
    userInput.focus();

    appendTypingIndicator();

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        removeTypingIndicator();

        if (!response.ok) {
            const errorText =
                data && data.message ?
                data.message :
                "The server reported an error.";
            appendMessage(`⚠️ ${errorText}`, "bot");
            return;
        }

        if (data && data.reply) {
            setTimeout(() => {
                appendMessage(data.reply, "bot");
            }, 150);
        } else {
            appendMessage(
                "Hmm, I got an empty response from the server 🤔",
                "bot"
            );
        }
    } catch (err) {
        console.error(err);
        removeTypingIndicator();
        appendMessage(
            "❌ Network error: unable to reach the server. Is it running on port 3000?",
            "bot"
        );
    }
}
// ------------ EXTRA UI INTERACTIONS ------------

// Smooth scroll for nav links
document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").slice(1);
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// Sync top nav theme toggle with chat theme
const navThemeToggle = document.getElementById("nav-theme-toggle");
if (navThemeToggle) {
    navThemeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light");
        const theme = document.body.classList.contains("light") ? "light" : "dark";
        localStorage.setItem("chat-theme", theme);
    });
}

// FAQ accordion
document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-question");
    btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item").forEach((el) => el.classList.remove("open"));
        if (!isOpen) item.classList.add("open");
    });
});

// Footer year
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Demo prompt chips send messages to chat
document.querySelectorAll(".prompt-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
        const text = chip.getAttribute("data-text");
        if (!text) return;
        // Ensure chatbot is open, then send message
        if (chatbot.style.display === "none" || chatbot.style.display === "") {
            chatbot.style.display = "flex";
            showWelcomeMessage();
        }
        sendMessage(text);
    });
});