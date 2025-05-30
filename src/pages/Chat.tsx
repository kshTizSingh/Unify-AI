import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface';

const Chat: React.FC = () => {
  const navigate = useNavigate();

  const handleStartComparison = (comparisonData?: {
    prompt: string;
    leftModel: string;
    leftResponse: string;
  }) => {
    if (comparisonData) {
      // Navigate with comparison data for pre-population
      navigate('/comparison', { 
        state: { 
          initialComparison: comparisonData 
        } 
      });
    } else {
      // Navigate to empty comparison
      navigate('/comparison');
    }
  };

  return (
    <ChatInterface onStartComparison={handleStartComparison} />
  );
};

export default Chat;
