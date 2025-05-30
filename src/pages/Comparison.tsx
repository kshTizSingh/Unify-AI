import React from 'react';
import { useLocation } from 'react-router-dom';
import ComparisonInterface from '../components/ComparisonInterface';

interface ComparisonData {
  prompt: string;
  leftModel: string;
  leftResponse: string;
}

const Comparison: React.FC = () => {
  const location = useLocation();
  const initialComparison = location.state?.initialComparison as ComparisonData | undefined;

  return <ComparisonInterface initialComparison={initialComparison} />;
};

export default Comparison;
