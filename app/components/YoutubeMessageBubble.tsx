import React from 'react';

export default function YoutubeMessageBubble({ role, content }: { role: string; content: string }) {
  const bgColor = role === 'user' ? 'bg-blue-600' : 'bg-gray-700';
  return (
    <div className={`p-2 my-1 rounded ${bgColor} w-fit max-w-[80%]`}>{content}</div>
  );
}