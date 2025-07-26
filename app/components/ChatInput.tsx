import React from 'react';

export default function ChatInput({ input, setInput, onSend, disabled }: {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex w-full">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSend()}
        placeholder="Ask a question..."
        disabled={disabled}
        className="flex-grow p-2 rounded text-white"
      />
      <button
        onClick={onSend}
        disabled={disabled}
        className="ml-2 px-4 py-2 bg-green-500 rounded hover:bg-green-600"
      >
        Send
      </button>
    </div>
  );
}