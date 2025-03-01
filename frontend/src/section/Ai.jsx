import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, AlertTriangle, Info } from "lucide-react";

const EMERGENCY_KEYWORDS = [
  "chest pain",
  "difficulty breathing",
  "shortness of breath",
  "severe bleeding",
  "uncontrollable bleeding",
  "paralysis",
  "sudden weakness",
  "facial drooping",
  "suicidal",
  "homicidal",
  "self harm",
  "unconscious",
  "unresponsive",
  "fainted",
  "choking",
  "can't breathe",
  "airway blocked",
  "severe burn",
  "chemical burn",
  "poisoning",
  "overdose",
  "ingested",
  "seizure",
  "convulsion",
  "stroke",
  "severe headache",
  "worst headache",
  "anaphylaxis",
  "allergic reaction",
  "severe abdominal pain",
  "appendicitis",
  "slurred speech",
  "confusion",
  "disorientation",
];

const responseCache = new Map();
const CACHE_EXPIRY = 60 * 60 * 1000;

const getModelForQuery = (query) => {
  if (query.split(" ").length > 15 || query.includes(",")) {
    return "gemini-1.5-pro";
  }
  return "gemini-1.5-flash";
};

const sanitizeInput = (input) => {
  return input
    .replace(/[^\p{L}\p{N}\s.,?!-:;()]/gu, "")
    .trim()
    .substring(0, 800);
};

const containsEmergencyKeywords = (input) => {
  const lowerInput = input.toLowerCase();
  return EMERGENCY_KEYWORDS.some((keyword) => lowerInput.includes(keyword));
};

const getCacheKey = (input) => {
  return input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
};

const Ai = () => {
  const API_KEY = "AIzaSyCiO0Ep9g6YCDcdks_Xar-xm_4VNemkTyM";

  // In your state initialization
const [messages, setMessages] = useState([
    {
      text: "👋 Welcome to CaloriSensei! I'm your fitness and nutrition assistant. Ask me about:\n\n💪 Exercises\n🍽️ Fat loss diets\n🏋️ Athlete training\n📝 Recipes from any cuisine\n\nHow can I help you today?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("en");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Detect language from user input
  // Update language detection to be more accurate
const detectLanguage = (text) => {
    // Only detect language if there's a clear pattern
    if (/[\u0600-\u06FF]{3,}/.test(text)) return "ar"; // At least 3 Arabic characters
    if (/[\u0900-\u097F]{3,}/.test(text)) return "hi"; // At least 3 Hindi characters
    if (/(?:hola|como|gracias|buenos|días)/.test(text.toLowerCase())) return "es";
    if (/(?:bonjour|merci|comment|salut)/.test(text.toLowerCase())) return "fr";
    return "en"; // Default to English
  };
  
  // Use a consistent disclaimer in the user's language
  const getEmergencyMessage = (lang) => {
    const disclaimers = {
      en: "\n\n🔍 Note: This is general fitness advice. Always consult a professional.",
      es: "\n\n🔍 Nota: Este es un consejo general de acondicionamiento físico. Consulte siempre a un profesional.",
      fr: "\n\n🔍 Remarque: Il s'agit de conseils généraux de remise en forme. Consultez toujours un professionnel.",
      ar: "\n\n🔍 ملاحظة: هذه نصيحة لياقة بدنية عامة. استشر دائمًا أخصائيًا.",
      hi: "\n\n🔍 नोट: यह सामान्य फिटनेस सलाह है। हमेशा एक पेशेवर से परामर्श करें।"
    };
    return disclaimers[lang] || disclaimers.en;
  };

  const getAIResponse = async (userInput) => {
    try {
      const detectedLang = detectLanguage(userInput);
      setLanguage(detectedLang);
  
      if (containsEmergencyKeywords(userInput)) {
        return getEmergencyMessage(detectedLang);
      }
  
      const cacheKey = getCacheKey(userInput);
      if (responseCache.has(cacheKey)) {
        const cachedData = responseCache.get(cacheKey);
        if (Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
          return cachedData.response;
        }
      }
  
      const model = getModelForQuery(userInput);
      const cleanInput = sanitizeInput(userInput);
      
      // Detect query type to provide more focused responses
      const queryType = determineQueryType(cleanInput);
      
      const promptTemplate = {
        en: `You are a fitness and nutrition expert named CaloriSensei. Follow these rules STRICTLY:
  1. IMPORTANT: Only answer what was asked for! If user asks only about food, don't include exercise info.
  2. Stay focused on the user's specific question - don't provide unrelated sections.
  3. ${queryType === 'exercise' ? 'Provide detailed exercise routines and techniques' : ''}
  4. ${queryType === 'nutrition' || queryType === 'food' ? 'Offer nutrition advice and food suggestions' : ''}
  5. ${queryType === 'recipe' ? 'Provide recipes with nutritional breakdown' : ''}
  6. ${queryType === 'training' ? 'Share athlete-specific training advice' : ''}
  7. Use simple language (8th grade level)
  8. Always respond in the same language as the user's query
  
  ${queryType === 'general' ? 'Format responses with ONLY relevant sections from:' : 'ONLY use the sections that directly answer the user\'s question:'}
  ${queryType === 'exercise' || queryType === 'general' ? '💪 Exercise: [Details]' : ''}
  ${queryType === 'nutrition' || queryType === 'food' || queryType === 'general' ? '🍽️ Nutrition: [Details]' : ''}
  ${queryType === 'nutrition' || queryType === 'food' || queryType === 'recipe' || queryType === 'general' ? '📊 Macronutrients: [Breakdown]' : ''}
  ${queryType === 'recipe' || queryType === 'general' ? '📝 Recipe: [Instructions]' : ''}
  ⚠️ Safety Note: [If applicable]`,
        // Add other language prompts if needed
      };
  
      const promptLang = promptTemplate[detectedLang] || promptTemplate.en;
  
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${promptLang}
  
  User input: ${cleanInput}`,
                  },
                ],
              },
            ],
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
            ],
            generationConfig: {
              temperature: 0.2,
              topP: 0.7,
              maxOutputTokens: 800,
            },
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Details:", errorData);
        throw new Error(
          `API Error: ${errorData.error?.message || "Unknown error"}`
        );
      }
  
      const data = await response.json();
      const aiText =
        data.candidates?.[0]?.content?.parts[0]?.text ||
        "I'm unable to provide information right now. Please try again.";
  
      // Always use English for disclaimer if language not supported
      const disclaimer = "\n\n🔍 Note: This is general fitness advice. Always consult a professional before starting any diet or exercise regimen.";
      const fullResponse = aiText + disclaimer;
  
      responseCache.set(cacheKey, {
        response: fullResponse,
        timestamp: Date.now(),
      });
  
      return fullResponse;
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
  
      const errorMessages = {
        en: "Service unavailable. Please try again later.",
        es: "Servicio no disponible. Por favor, inténtelo más tarde.",
      };
  
      return errorMessages[language] || errorMessages.en;
    }
  };
  
  // Helper function to determine query type
  const determineQueryType = (query) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("exercise") || lowerQuery.includes("workout") || 
        lowerQuery.includes("cardio") || lowerQuery.includes("strength") ||
        lowerQuery.includes("training program") || lowerQuery.includes("routine")) {
      return "exercise";
    }
    
    if (lowerQuery.includes("recipe") || lowerQuery.includes("cook") || 
        lowerQuery.includes("meal prep") || lowerQuery.includes("dish") ||
        lowerQuery.includes("food preparation")) {
      return "recipe";
    }
    
    if (lowerQuery.includes("food") || lowerQuery.includes("eat") || 
        lowerQuery.includes("diet") || lowerQuery.includes("nutrition") ||
        lowerQuery.includes("meal") || lowerQuery.includes("macros")) {
      return "nutrition";
    }
    
    if (lowerQuery.includes("athlete") || lowerQuery.includes("training") || 
        lowerQuery.includes("performance") || lowerQuery.includes("sport") ||
        lowerQuery.includes("competition") || lowerQuery.includes("bulking")) {
      return "training";
    }
    
    return "general";
  };

  const retryWithExponentialBackoff = async (fn, maxRetries = 3) => {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        return await fn();
      } catch (error) {
        retries++;
        if (retries >= maxRetries) throw error;

        const delay = Math.min(
          1000 * 2 ** retries + Math.random() * 1000,
          10000
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  const handleSendMessage = async () => {
    const cleanInput = sanitizeInput(input);
    if (!cleanInput) return;

    const userMessage = { text: cleanInput, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      const response = await retryWithExponentialBackoff(() =>
        getAIResponse(cleanInput)
      );
      setMessages((prev) => [...prev, { text: response, sender: "ai" }]);
    } catch (error) {
      console.error("Final error after retries:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Medical analysis unavailable. Please contact a healthcare provider.",
          sender: "ai",
        },
      ]);
      setError("Service temporarily unavailable. Please try again later.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        text: "👋 Welcome to CaloriSensei! I'm your fitness and nutrition assistant. Ask me about:\n\n💪 Exercises\n🍽️ Fat loss diets\n🏋️ Athlete training\n📝 Recipes from any cuisine\n\nHow can I help you today?",
        sender: "ai",
      },
    ]);
    setError(null);
  };

  useEffect(() => {
    const handleOnline = () => {
      setError("Connection restored. You can continue your consultation.");
      setTimeout(() => setError(null), 3000);
    };

    const handleOffline = () => {
      setError(
        "Network connection lost. Please check your internet connection."
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const MessageBubble = ({ message }) => {
    const isAI = message.sender === "ai";
    return (
      <div
        className={`flex items-start gap-3 mb-4 ${
          isAI ? "justify-start" : "justify-end"
        }`}
      >
        {isAI && (
          <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
        )}
        <div
          className={`max-w-[85%] p-4 rounded-2xl ${
            isAI ? "bg-gray-800 text-white border border-gray-700" : "bg-blue-600 text-white"
          }`}
        >
          <pre className="whitespace-pre-wrap font-sans text-sm">
            {message.text}
          </pre>
        </div>
        {!isAI && (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2 mt-20">
      <div className="bg-gray-900 rounded-2xl shadow-md border border-gray-800">
        <header className="p-4 border-b border-gray-800">
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-500" />
            CaloriSensei
          </h1>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handleClearChat}
              className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1 py-1 px-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <span>Clear conversation</span>
            </button>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Info className="w-3 h-3" />
              <span>AI-powered fitness assistant</span>
            </div>
          </div>
        </header>

        <main className="h-[50vh] overflow-y-auto p-6 bg-black">
          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-800 rounded-xl flex items-center gap-2 text-red-200">
              <AlertTriangle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-5 border-t border-gray-800">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about exercises, fat loss, athlete training, recipes, or nutrition..."
              rows="1"
              className="flex-1 p-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none text-sm bg-gray-800 text-white"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-between items-center mt-3">
            <p className="text-xs text-gray-500 font-light">
              Fitness advice is not a replacement for professional guidance.
            </p>
            <div className="flex items-center gap-1">
              <Info className="w-3 h-3 text-blue-500" />
              <span className="text-xs text-blue-400 font-medium">
                Powered by CaloriSensei
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Ai;
