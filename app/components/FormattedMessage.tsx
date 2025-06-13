"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function FormattedMessage({ content }: { content: string }) {
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ node, ...props }) => <p className="mb-3" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}