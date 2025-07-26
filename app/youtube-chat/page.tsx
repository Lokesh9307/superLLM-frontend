// youtube-chat/page.tsx
'use client';

import { askYouTubeQuestion } from '@/utils/api';
import { useState } from 'react';


export default function YouTubeChatPage() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnswer('');
    setLoading(true);
    try {
      const res = await askYouTubeQuestion(youtubeUrl, question);
      setAnswer(res);
    } catch (err) {
      console.error(err);
      setAnswer('Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-xl w-full">
        <h1 className="text-2xl font-semibold mb-4">YouTube Chatbot</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter YouTube URL"
            className="w-full p-2 border rounded"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            required
          />
          <textarea
            placeholder="Ask a question..."
            className="w-full p-2 border rounded h-24"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Ask'}
          </button>
        </form>
        {answer && (
          <div className="mt-6 p-4 bg-gray-100 border rounded">
            <strong>Answer:</strong>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </main>
  );
}
