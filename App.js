// src/App.js

import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/chat', { message });
      setResponse(res.data.reply);
    } catch (error) {
      console.error('Error communicating with server:', error);
      setResponse('Something went wrong.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>AI Chatbot</h1>
      <textarea
        rows="4"
        cols="50"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <br />
      <button onClick={handleSend}>Send</button>
      <div style={{ marginTop: '20px' }}>
        <strong>Response:</strong>
        <p>{response}</p>
      </div>
    </div>
  );
}

export default App;
