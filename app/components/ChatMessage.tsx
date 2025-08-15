'use client';

import { useEffect, useState } from 'react';
import { UserIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { FaRegUserCircle,FaRobot  } from "react-icons/fa";


interface ChatMessageProps {
  question: string;
  answer: string;
  isLoading?: boolean;
}

const useTypewriter = (text: string, speed: number = 20) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!text || text === 'Thinking...') return;

    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return displayText || text;
};

export default function ChatMessage({ question, answer, isLoading = false }: ChatMessageProps) {
  const displayAnswer = useTypewriter(isLoading ? 'Thinking...' : answer);

  return (
    <div className="space-y-3 animate-fade-in">
      {/* User Question */}
      <div className="flex justify-end">
        <div className="flex items-start gap-3 max-w-[70%] bg-blue-600 text-white p-4 rounded-xl rounded-br-none shadow-lg transition-transform duration-300 ease-in-out">
          <UserIcon className="h-6 w-6 mt-1 text-blue-200 flex-shrink-0" />
          <div>
            <p className="font-semibold text-blue-100 text-sm flex items-center gap-2"><span>{<FaRegUserCircle />}</span>You</p>
            <p className="mt-1">{question}</p>
          </div>
        </div>
      </div>
      {/* AI Answer */}
      <div className="flex justify-start">
        <div className="flex items-start gap-3 max-w-[70%] bg-gray-800 text-white p-4 rounded-xl rounded-bl-none shadow-lg transition-transform duration-300 ease-in-out">
          <SparklesIcon className="h-6 w-6 mt-1 text-purple-300 flex-shrink-0" />
          <div>
            <p className="font-semibold text-purple-300 text-sm"><span>{<FaRobot />}</span>AI</p>
            <p className="mt-1">{isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-purple-300" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Thinking...
              </span>
            ) : (
              displayAnswer
            )}</p>
          </div>
        </div>
      </div>
    </div>
  );
}