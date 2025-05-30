
import React, { useState } from 'react';
import { ChevronDownIcon } from './ui/icons';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  models: string[];
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange, models }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="neuro-button flex items-center gap-2 px-4 py-2 rounded-lg text-purple-700 font-medium min-w-[200px] justify-between"
      >
        <span className="opacity-80">{selectedModel}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full glass-card rounded-lg shadow-xl z-50 overflow-hidden">
          {models.map((model) => (
            <button
              key={model}
              onClick={() => {
                onModelChange(model);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-3 text-left transition-colors
                ${selectedModel === model 
                  ? 'bg-purple-100/70 text-purple-700' 
                  : 'text-gray-600 hover:bg-purple-50/50'
                }
              `}
            >
              {model}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
