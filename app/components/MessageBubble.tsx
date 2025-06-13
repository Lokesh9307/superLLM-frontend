type Props = {
  text: string;
  isUser: boolean;
};

export default function MessageBubble({ text, isUser }: Props) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
      <div className={`p-3 rounded-lg max-w-lg ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
        <span>{isUser ? 'You: ' : 'Bot: '}</span>{text}
      </div>
    </div>
  );
}
