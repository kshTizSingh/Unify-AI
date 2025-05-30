
import React from 'react';
import { ResearchIcon } from '../components/ui/icons';

const Research: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-purple-200/50">
        <h2 className="text-xl font-medium text-gray-800 tracking-tighter flex items-center gap-2">
          <ResearchIcon className="w-6 h-6" />
          Research
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="glass-card p-8 rounded-3xl">
            <ResearchIcon className="w-16 h-16 text-purple-500 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-gray-800 mb-4 tracking-tighter">
              AI Research Assistant
            </h3>
            <p className="text-gray-600 opacity-80 mb-6">
              Research functionality coming soon. Get comprehensive research assistance powered by AI.
            </p>
            <button className="neuro-button px-8 py-3 rounded-xl text-purple-700 font-medium">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;
