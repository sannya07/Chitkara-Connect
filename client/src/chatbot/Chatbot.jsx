import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false); // Widget toggle
  const [chatHistory, setChatHistory] = useState([]);
  const [options, setOptions] = useState([]);
  const [showMore, setShowMore] = useState(false); // Toggle to show more questions

  const chatEndRef = useRef(null); // Reference to the bottom of the chat
  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/questions`);
        setOptions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleOptionClick = (option) => {
    setChatHistory((prev) => [
      ...prev,
      { user: true, text: option.question },
      { user: false, text: option.answer }
    ]);
    // Remove answered question
    setOptions((prev) => prev.filter((opt) => opt.id !== option.id));
  };

  return (
    <div>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-700 focus:outline-none"
      >
        💬
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 w-96 bg-gray-100 shadow-md rounded">
          {/* Chat Header */}
          <div className="p-3 bg-red-500 text-white text-lg font-semibold flex justify-between items-center rounded-t">
            <span>ChitkaraConnect Bot</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Chat History */}
          <div className="h-52 overflow-y-auto p-3 bg-white">
            {chatHistory.length === 0 ? (
              <p className="text-gray-500 text-center">Ask a question to start!</p>
            ) : (
              chatHistory.map((entry, index) => (
                <div
                  key={index}
                  className={`mb-2 ${entry.user ? 'text-right' : 'text-left'}`}
                >
                  <p
                    className={`inline-block p-2 rounded ${
                      entry.user
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-300'
                    }`}
                  >
                    {entry.text}
                  </p>
                </div>
              ))
            )}
            {/* Scroll Anchor */}
            <div ref={chatEndRef} />
          </div>

          {/* Question Options */}
          <div className="h-36 overflow-y-auto p-3 bg-gray-50 space-y-2">
            {options.slice(0, showMore ? options.length : 5).map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleOptionClick(opt)}
                className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700"
              >
                {opt.question}
              </button>
            ))}
            {options.length > 5 && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="w-full py-1 px-4 bg-gray-200 text-red-500 rounded hover:bg-gray-300"
              >
                {showMore ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;