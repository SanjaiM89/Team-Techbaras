import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';

type Message = {
  text: string;
  isBot: boolean;
};

export default function WorkoutChatbot() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm your AI workout assistant. Need help with form, technique, or have any questions?",
      isBot: true
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setMessages([...messages, { text: message, isBot: false }]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "I'll help you with that! What specific aspect would you like to know more about?",
        isBot: true
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-20 right-6 bg-primary text-dark p-4 rounded-full shadow-lg z-50"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chatbot Modal */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-dark-light rounded-xl w-full max-w-md">
              <div className="p-4 border-b border-dark-lighter flex justify-between items-center">
                <h2 className="text-xl font-bold">Workout Assistant</h2>
                <button onClick={() => setShowChatbot(false)}>
                  <X className="text-gray-400" />
                </button>
              </div>
              
              <div className="p-4 h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-3 ${
                        msg.isBot ? 'bg-dark-lighter' : 'bg-primary/10 ml-auto'
                      }`}
                    >
                      <p className={msg.isBot ? 'text-gray-400' : 'text-white'}>{msg.text}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about your workout..."
                    className="flex-1 bg-dark-lighter rounded-lg px-4 py-2 text-white"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-primary text-dark px-4 py-2 rounded-lg font-semibold"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}