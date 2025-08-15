'use client';

interface InputSectionProps {
  videoUrl: string;
  setVideoUrl: (value: string) => void;
  question: string;
  setQuestion: (value: string) => void;
  loading: boolean;
  isProcessed: boolean;
  error: string | null;
  onProcessVideo: () => void;
  onAsk: () => void;
}

export default function InputSection({
  videoUrl,
  setVideoUrl,
  question,
  setQuestion,
  loading,
  isProcessed,
  error,
  onProcessVideo,
  onAsk,
}: InputSectionProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading && question && isProcessed) {
      onAsk();
    }
  };

  return (
    <div className="p-6 space-y-5 bg-gray-900">
      {/* Video Input */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Paste YouTube Video URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          disabled={loading}
          className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500 disabled:opacity-50 transition duration-300 ease-in-out"
        />
        <button
          onClick={onProcessVideo}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold text-white disabled:opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Processing...
            </span>
          ) : (
            'Process Video'
          )}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-sm animate-pulse">{error}</p>
      )}
      {/* Question Input */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Ask a question about the video..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading || !isProcessed}
          className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500 disabled:opacity-50 transition duration-300 ease-in-out"
        />
        <button
          onClick={onAsk}
          disabled={loading || !question || !isProcessed}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold text-white disabled:opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Ask
        </button>
      </div>
    </div>
  );
}