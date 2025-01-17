import React, { useState } from 'react';
import axios from 'axios';
import ImageUploader from '../components/Home/ImageUploader';
import MessageList from '../components/Home/MessageList';
import TissueDescription from '../components/Home/TissueDescription';

function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);

  const handleSend = async () => {
    if (input.trim() || image) {
      const userMessage = { image, text: input };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInput("");

      if (image) {
        try {
          const predictionText = await predictImage(image);
          const organType = predictionText.split(' ')[0].toLowerCase(); // Extract organ type

          // Add prediction message
          const botMessage = {
            image: null,
            text: `Prediction: ${predictionText}`,
          };
          setMessages(prevMessages => [...prevMessages, botMessage]);

          // Add educational content if it's a lung or kidney
          if (organType === 'lung' || organType === 'kidney') {
            const educationalMessage = {
              image: null,
              text: null,
              component: <TissueDescription organType={organType} />
            };
            setMessages(prevMessages => [...prevMessages, educationalMessage]);
          }
        } catch (error) {
          console.error("Prediction error:", error);
          const errorMessage = {
            image: null,
            text: `Error: ${error.message}. Please try again.`,
          };
          setMessages(prevMessages => [...prevMessages, errorMessage]);
        }
      }
      setImage(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const predictImage = async (imageUrl) => {
    try {
      const formData = new FormData();
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      formData.append('image', blob);

      const res = await axios.post('http://localhost:3000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return `${res.data.label} (${res.data.confidence} confidence)`;
    } catch (error) {
      throw new Error("Failed to get prediction from the server");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 w-full bg-gray-800 border-t border-gray-700 p-4">
        <ImageUploader
          onImageChange={handleImageChange}
          onSend={handleSend}
          image={image}
        />
      </div>
    </div>
  );
}

export default ChatBot;
