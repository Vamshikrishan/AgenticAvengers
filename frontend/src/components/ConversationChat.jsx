import { useState, useRef, useEffect } from "react";
import api from "../api/api";
import { useVoiceInput, speakText } from "./useVoice";

export default function ConversationChat() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi 👋 Tell me about your day." }
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // 🎙 Voice input hook
  const { startListening } = useVoiceInput((spokenText) => {
    if (spokenText) {
      setInput(spokenText);
      sendMessage(spokenText);
    }
  });

  // ⬇ Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🚀 Send message
  const sendMessage = async (overrideText) => {
    const text = (overrideText || input).trim();
    if (!text) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");

    try {
      const res = await api.post("/analyze", { text });
      const reply = res?.data?.reply || "I’m here to help 🙂";

      // Add AI message
      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);

      // 🔊 AI speaks
      speakText(reply);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Something went wrong. Please try again." }
      ]);
    }
  };

  return (
    <div className="chat-container">
      {/* 💬 Messages */}
      <div className="messages">
        {messages.map((msg, index) =>
          msg.text ? (
            <div key={index} className={`bubble ${msg.sender}`}>
              {msg.text}
            </div>
          ) : null
        )}
        <div ref={bottomRef} />
      </div>

      {/* ⌨ Input Bar */}
      <div className="input-bar">
        <button onClick={startListening} title="Speak">
          🎤
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or speak..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={() => sendMessage()} title="Send">
          ➤
        </button>
      </div>
    </div>
  );
}
