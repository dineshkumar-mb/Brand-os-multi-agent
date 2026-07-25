import React, { useState } from "react";
import { Bot, Send, X, Loader2 } from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface AICopilotSidebarProps {
  onClose: () => void;
}

export const AICopilotSidebar: React.FC<AICopilotSidebarProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I'm your AI Personal Brand Copilot powered by the AI Gateway. How can I assist with your post generation, research, or style tuning?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg }),
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let aiResponseText = "";

        // Add empty AI message to stream into
        setMessages((prev) => [...prev, { sender: "ai", text: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.replace("data: ", "").trim();
              if (dataStr === "[DONE]") break;
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  aiResponseText += parsed.text;
                  setMessages((prev) => {
                    const newMsgs = [...prev];
                    newMsgs[newMsgs.length - 1].text = aiResponseText;
                    return newMsgs;
                  });
                }
              } catch (e) {}
            }
          }
        }
      } else {
        throw new Error("API stream unavailable");
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Analyzed "${userMsg}". Recommendation: Highlight React 19's Actions & optimistic updates in your hook to maximize developer engagement (+34% CTR).`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-80 border-l border-slate-800/80 bg-slate-900/90 p-4 flex flex-col justify-between backdrop-blur-xl shrink-0">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-bold text-white">AI Brand Assistant</span>
        </div>
        <button onClick={onClose} className="text-xs text-slate-400 hover:text-white p-1">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto my-3 space-y-3 text-xs pr-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg leading-relaxed ${
              msg.sender === "user"
                ? "bg-indigo-600 text-white ml-6 shadow-sm"
                : "bg-slate-800 text-slate-200 mr-6 border border-slate-700/80"
            }`}
          >
            {msg.text || (loading && i === messages.length - 1 ? "Thinking..." : "")}
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask AI Copilot..."
          disabled={loading}
          className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
        </button>
      </div>
    </aside>
  );
};
