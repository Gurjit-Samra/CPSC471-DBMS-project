// tech_storefront/frontend/src/components/ChatbotBubble.js
import React, { useState } from "react";
import { IoChatbubblesSharp } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";

export default function ChatbotBubble({ currentPage }) {
    const [isOpen, setIsOpen] = useState(false);
    const [conversation, setConversation] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Toggle chat open/close
    const handleToggleChat = () => {
        setIsOpen((prev) => !prev);
        setError("");
    };

    // Send the user’s message to the backend
    const handleSend = async () => {
        if (!userInput.trim()) return;
        const userMessage = userInput.trim();

        // Add user message to conversation
        setConversation((prev) => [...prev, { role: "user", text: userMessage }]);
        setUserInput("");
        setIsLoading(true);
        setError("");

        try {
        const resp = await fetch("/api/chatbot/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            userMessage: userMessage,
            currentPage: currentPage || window.location.pathname,
            }),
        });

        if (!resp.ok) {
            const errData = await resp.json();
            setError(errData.error || "Error calling chatbot");
        } else {
            const data = await resp.json();
            if (!resp.ok) {
                setError(data.error || "Error calling chatbot");
            } else {
                // Get only the text
                const botReply = data.assistantReply || "(No reply)";
            

                setConversation((prev) => [
                ...prev,
                { role: "bot", text: botReply },
                ]);
        }
        }
        } catch (err) {
        console.error(err);
        setError("Network or server error contacting chatbot");
        } finally {
        setIsLoading(false);
        }
    };

    // Render
    return (
        <>
        {/* Chat Bubble Icon (when closed) */}
        {!isOpen && (
            <div
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#1976d2", // your brand color
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                color: "#fff",
                zIndex: 9999,
            }}
            onClick={handleToggleChat}
            >
            <IoChatbubblesSharp size={28} />
            </div>
        )}

        {/* Chat Window (when open) */}
        {isOpen && (
            <div
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                width: "350px",
                height: "450px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                zIndex: 9999,
            }}
            >
            {/* Header */}
            <div
                style={{
                backgroundColor: "#1976d2",
                color: "#fff",
                padding: "10px",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                }}
            >
                <span style={{ fontWeight: "bold" }}>FGG Tech Chatbot</span>
                <FaTimes
                style={{ cursor: "pointer" }}
                onClick={handleToggleChat}
                />
            </div>

            {/* Conversation Area */}
            <div
                style={{
                flex: 1,
                overflowY: "auto",
                padding: "10px",
                backgroundColor: "#f7f7f7",
                }}
            >
                {conversation.map((msg, i) => (
                <div
                    key={i}
                    style={{
                    marginBottom: "10px",
                    textAlign: msg.role === "user" ? "right" : "left",
                    }}
                >
                    <div
                    style={{
                        display: "inline-block",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        backgroundColor:
                        msg.role === "user" ? "#1976d2" : "#e0e0e0",
                        color: msg.role === "user" ? "#fff" : "#000",
                        maxWidth: "80%",
                        whiteSpace: "pre-wrap",
                    }}
                    >
                    {msg.text}
                    </div>
                </div>
                ))}
            </div>

            {/* Error */}
            {error && (
                <div style={{ color: "red", padding: "8px" }}>
                {error}
                </div>
            )}

            {/* Input + Send */}
            <div
                style={{
                borderTop: "1px solid #ccc",
                padding: "8px",
                display: "flex",
                }}
            >
                <input
                type="text"
                placeholder="Ask me anything..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                }}
                disabled={isLoading}
                style={{
                    flex: 1,
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    padding: "8px",
                    marginRight: "8px",
                }}
                />
                <button
                onClick={handleSend}
                disabled={isLoading}
                style={{
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0 16px",
                    cursor: "pointer",
                }}
                >
                {isLoading ? "..." : "Send"}
                </button>
            </div>
            </div>
        )}
        </>
    );
}
