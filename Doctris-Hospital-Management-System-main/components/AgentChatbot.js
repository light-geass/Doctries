"use client";
import React, { useState, useRef, useEffect } from "react";
import insforge from "@/utils/insforge";
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon, SparklesIcon, ChevronDownIcon, MicrophoneIcon } from "@heroicons/react/24/outline";

export default function AgentChatbot({ scanResult, patientData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Hello! I'm your AI health assistant. I've reviewed your recent ${scanResult?.diagnosis || 'scan'}. What would you like to know?` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input not supported in this browser. Try Chrome.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Build context payload
      const systemContext = `You are a highly capable AI medical assistant directly talking to a patient. 
You are currently providing support on the results page for their recent medical scan.
Here is the patient's data: ${JSON.stringify(patientData || {})}
Here is the exact scan result data: ${JSON.stringify(scanResult || {})}

Rules:
1. Ground all your answers strictly in the current scan result.
2. Be empathetic, concise, and professional.
3. If asked about treatment, remind them you are an AI and they should consult the recommended specialist.
4. Keep answers brief (max 2-3 short paragraphs).`;

      // Format previous messages for API
      const apiMessages = [
        { role: "system", content: systemContext },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: userMessage }
      ];

      const completion = await insforge.ai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: apiMessages,
      });

      const aiResponse = completion.choices[0].message.content;
      
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window */}
      <div 
        className={`bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 transform origin-bottom-right mb-4 ${
          isOpen ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-blue-200" />
            <h3 className="font-bold text-sm tracking-wide">Ask AI Assistant</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronDownIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Layout */}
        <div className="h-80 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-3">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-sm' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm shadow-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your scan..."
            className="flex-1 bg-slate-100 text-slate-800 text-sm rounded-full px-4 py-2 border-0 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-slate-400"
            disabled={isLoading}
          />
          <button 
            type="button"
            onClick={startListening}
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
            title="Use Voice Input"
          >
            <MicrophoneIcon className="w-5 h-5" />
          </button>
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 disabled:bg-slate-200 disabled:text-slate-400 transition-colors cursor-pointer"
          >
            <PaperAirplaneIcon className="w-5 h-5 -ml-0.5" />
          </button>
        </form>
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-900/20 transition-all duration-300 hover:scale-105 ${
          isOpen ? 'bg-slate-800' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        )}
      </button>

    </div>
  );
}
