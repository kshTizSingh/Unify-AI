import React from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 50, 
  className = '' 
}) => {
  const { displayedText, isTyping } = useTypewriter(text, speed);

  return (
    <span className={className}>
      {displayedText}
      {isTyping && <span className="animate-pulse">|</span>}
    </span>
  );
};

export default TypewriterText; 