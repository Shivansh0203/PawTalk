import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motionPresets } from '../../styles/motion';
import { Button } from '../../components/ui/Button';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Send, Mic, Paperclip, Sparkles, ArrowRight } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'mia';
  timestamp: Date;
  type?: 'text' | 'suggestion';
}

interface ConversationContext {
  petName: string;
  lastEmotion?: string;
  analysisCount: number;
}

const SUGGESTED_QUESTIONS = [
  'What does it mean when my pet tilts their head?',
  'How can I tell if my pet is stressed?',
  'What are common signs of playfulness?',
  'How do I improve my pet's communication?',
  'What should I do if my pet seems anxious?',
];

const MIA_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hi there! I'm Mia, your PawTalk companion. I'm here to help you understand your pet's behavior and communication patterns. What would you like to know?",
    "Hello! I'm Mia. I'm excited to help you interpret your pet's signals and emotions. Feel free to ask me anything about pet behavior.",
  ],
  emotion_question: [
    "That's a great question! Animal emotions are complex. From what we've observed in your analyses, I can help you recognize specific patterns. What emotion are you curious about?",
    "Understanding emotions is key to better communication. Based on your pet's history, I've noticed some interesting patterns. What would help you most?",
  ],
  behavior_question: [
    "Behavior is the language pets use to communicate with us. Each signal—whether it's body language, vocalizations, or movement—tells a story. Tell me more about what you've observed.",
    "That behavior can mean different things depending on context. From our previous analyses, I've seen your pet express this in interesting ways. What's happening right now?",
  ],
  general: [
    "That's an insightful observation. Pet communication is nuanced, and context matters. What else have you noticed about your pet's behavior?",
    "I appreciate that question. The more we understand our pets, the stronger our bond becomes. Have you noticed any patterns over time?",
    "That's worth paying attention to. Every pet is unique, and small details often reveal the most. What else would you like to explore?",
  ],
};

const getMiaResponse = (userMessage: string): string => {
  const lower = userMessage.toLowerCase();

  if (lower.includes('happy') || lower.includes('joy') || lower.includes('excited')) {
    return MIA_RESPONSES.emotion_question[Math.floor(Math.random() * MIA_RESPONSES.emotion_question.length)];
  }

  if (
    lower.includes('tail') ||
    lower.includes('head') ||
    lower.includes('ear') ||
    lower.includes('posture') ||
    lower.includes('body')
  ) {
    return MIA_RESPONSES.behavior_question[Math.floor(Math.random() * MIA_RESPONSES.behavior_question.length)];
  }

  return MIA_RESPONSES.general[Math.floor(Math.random() * MIA_RESPONSES.general.length)];
};

export default function ChatBotPage() {
  const [petName] = useLocalStorage('pawtalk-pet-name', 'Bruno');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      sender: 'mia',
      text: `Hi! I'm Mia, your PawTalk companion. I'm here to help you understand ${petName}'s communication and behavior. What would you like to know?`,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setShowSuggestions(false);
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600));

    // Get Mia response
    const miaMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: getMiaResponse(text),
      sender: 'mia',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, miaMessage]);
    setIsLoading(false);

    // Show suggestions after a few messages
    if (messages.length > 4) {
      setTimeout(() => setShowSuggestions(true), 1000);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleMicClick = () => {
    setIsListening(!isListening);
    // Mock speech recognition
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        // Simulate speech result
        const mockTranscript =
          SUGGESTED_QUESTIONS[Math.floor(Math.random() * SUGGESTED_QUESTIONS.length)];
        handleSendMessage(mockTranscript);
      }, 2000);
    }
  };

  const handleAttachmentClick = () => {
    // Mock attachment functionality
    const message = `I've attached an image of ${petName}. Can you help me understand the behavior shown?`;
    handleSendMessage(message);
  };

  return (
    <div className="min-h-screen bg-background-primary text-text-primary flex flex-col pb-20">
      {/* Header */}
      <motion.div
        className="sticky top-0 z-20 pt-6 px-6 pb-4 border-b border-background-tertiary bg-background-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center">
              <Sparkles size={20} className="text-neutral-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Mia</h1>
              <p className="text-xs text-text-secondary">Your PawTalk companion</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 px-6 py-8 overflow-y-auto max-w-2xl mx-auto w-full">
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut', delay: index * 0.05 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl px-4 py-3 backdrop-blur-sm
                    ${
                      message.sender === 'user'
                        ? 'bg-accent-primary text-neutral-white rounded-br-none'
                        : 'bg-background-tertiary text-text-primary border border-background-secondary rounded-bl-none'
                    }
                  `}
                >
                  {/* Typing animation for Mia's response */}
                  {message.sender === 'mia' && isLoading && index === messages.length - 1 ? (
                    <div className="flex gap-1 py-1">
                      {[0, 1, 2].map((dot) => (
                        <motion.div
                          key={dot}
                          className="w-2 h-2 rounded-full bg-accent-primary"
                          animate={{ y: [0, -6, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: dot * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed break-words">{message.text}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && messages[messages.length - 1]?.sender === 'user' && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-background-tertiary border border-background-secondary text-text-primary rounded-2xl rounded-bl-none px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((dot) => (
                    <motion.div
                      key={dot}
                      className="w-2 h-2 rounded-full bg-accent-primary"
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: dot * 0.1,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <AnimatePresence>
        {showSuggestions && messages.length > 2 && (
          <motion.div
            className="px-6 py-4 max-w-2xl mx-auto w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
              Quick questions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_QUESTIONS.slice(0, 4).map((question, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-left p-3 rounded-lg bg-background-tertiary border border-background-secondary text-text-secondary text-xs hover:border-accent-primary hover:text-accent-primary transition-all group"
                  whileHover={{ scale: 1.02, borderColor: '#9333ea' }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="line-clamp-2">{question}</span>
                    <ArrowRight size={14} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background-primary via-background-primary to-transparent pt-4 px-6 pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3 items-end">
            {/* Attachment Button */}
            <motion.button
              onClick={handleAttachmentClick}
              className="flex-shrink-0 w-10 h-10 rounded-lg bg-background-tertiary border border-background-secondary text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Attach image"
            >
              <Paperclip size={18} />
            </motion.button>

            {/* Input Field */}
            <motion.div
              className="flex-1 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask Mia something..."
                className="w-full px-4 py-3 rounded-lg bg-background-tertiary border border-background-secondary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-20 transition-all text-sm"
              />
            </motion.div>

            {/* Microphone Button */}
            <motion.button
              onClick={handleMicClick}
              className={`flex-shrink-0 w-10 h-10 rounded-lg transition-all flex items-center justify-center ${
                isListening
                  ? 'bg-accent-primary text-neutral-white'
                  : 'bg-background-tertiary border border-background-secondary text-text-secondary hover:text-accent-primary hover:border-accent-primary'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isListening ? { scale: [1, 1.05, 1] } : {}}
              transition={isListening ? { duration: 1.5, repeat: Infinity } : {}}
              title="Use microphone"
            >
              <Mic size={18} />
            </motion.button>

            {/* Send Button */}
            <motion.button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-primary text-neutral-white hover:bg-accent-primaryLight disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              whileHover={{ scale: input.trim() && !isLoading ? 1.05 : 1 }}
              whileTap={{ scale: input.trim() && !isLoading ? 0.95 : 1 }}
              title="Send message"
            >
              <Send size={18} />
            </motion.button>
          </div>

          {/* Help text */}
          <p className="text-xs text-text-tertiary mt-2 text-center">
            Mia uses AI to help interpret your pet's behavior • Not veterinary advice
          </p>
        </div>
      </motion.div>
    </div>
  );
}
