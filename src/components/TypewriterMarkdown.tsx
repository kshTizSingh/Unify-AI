import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTypewriter } from '../hooks/useTypewriter';

interface TypewriterMarkdownProps {
  text: string;
  speed?: number;
  className?: string;
  isNewMessage?: boolean;
}

const TypewriterMarkdown: React.FC<TypewriterMarkdownProps> = ({ 
  text, 
  speed = 5,
  className = '',
  isNewMessage = true
}) => {
  const { displayedText, isTyping } = useTypewriter(isNewMessage ? text : '', speed);
  const finalText = isNewMessage ? displayedText : text;

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-xl font-bold text-gray-800 mb-3 mt-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-semibold text-gray-800 mb-2 mt-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-medium text-gray-800 mb-2 mt-2">{children}</h3>,
          p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-gray-700">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-gray-800">{children}</strong>,
          em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
          code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-purple-700">{children}</code>,
          pre: ({ children }) => <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto mb-2">{children}</pre>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-purple-300 pl-4 italic text-gray-600 mb-2">{children}</blockquote>,
          table: ({ children }) => <table className="table-auto border-collapse border border-gray-300 mb-2 w-full">{children}</table>,
          thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-b border-gray-200">{children}</tr>,
          th: ({ children }) => <th className="border border-gray-300 px-3 py-2 text-left font-semibold">{children}</th>,
          td: ({ children }) => <td className="border border-gray-300 px-3 py-2">{children}</td>,
        }}
      >
        {finalText}
      </ReactMarkdown>
      {isTyping && <span className="animate-pulse text-purple-600 ml-1">|</span>}
    </div>
  );
};

export default TypewriterMarkdown; 