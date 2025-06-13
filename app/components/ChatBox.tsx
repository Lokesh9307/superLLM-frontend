'use client';

import { useState } from 'react';
import MessageBubble from './MessageBubble';
import { sendYouTubeQuestion } from '@/utils/api';

export default function ChatBox({ domain }: { domain: string }) {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const response = await sendYouTubeQuestion(domain, input, []);
    const botMessage = { text: response.answer, isUser: false };
    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, i) => (
          <MessageBubble key={i} {...msg} />
        ))}
      </div>
      <div className="flex items-center mt-4">
        <input
          type="text"
          className="flex-1 p-2 rounded border"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask your question..."
        />
        <button onClick={handleSend} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
}
