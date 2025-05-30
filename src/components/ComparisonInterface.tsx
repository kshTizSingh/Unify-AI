import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, PlusIcon, ChatIcon, ImageIcon, VideoIcon } from './ui/icons';
import ModelSelector from './ModelSelector';
import { sendMessageToGemini } from '../services/gemini';
import { sendMessageToOpenAI } from '../services/openai';
import TypewriterMarkdown from './TypewriterMarkdown';

interface ComparisonResponse {
  model: string;
  content: string;
  timestamp: Date;
}

interface ComparisonData {
  prompt: string;
  leftModel: string;
  leftResponse: string;
}

interface ComparisonInterfaceProps {
  initialComparison?: ComparisonData;
}

const ComparisonInterface: React.FC<ComparisonInterfaceProps> = ({ initialComparison }) => {
  const [selectedModels, setSelectedModels] = useState<string[]>(['GPT-3.5 Turbo', 'Gemini Pro']);
  const [inputValue, setInputValue] = useState('');
  const [responses, setResponses] = useState<ComparisonResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTool, setSelectedTool] = useState('chat');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsEndRef = useRef<HTMLDivElement>(null);
  const [newestResponseIds, setNewestResponseIds] = useState<Set<string>>(new Set());

  const availableModels = ['GPT-3.5 Turbo', 'GPT-4', 'Gemini Pro', 'Claude-3', 'Llama-2'];
  
  const tools = [
    { id: 'chat', name: 'Chat', icon: ChatIcon },
    { id: 'image', name: 'Image Gen', icon: ImageIcon, isPro: true, label: 'Coming Soon' },
    { id: 'video', name: 'Video Gen', icon: VideoIcon, isPro: true, label: 'Coming Soon' },
  ];

  // Load data from localStorage on component mount
  useEffect(() => {
    // Don't load from localStorage if we have initial comparison data
    if (!initialComparison) {
      const savedResponses = localStorage.getItem('comparison-responses');
      const savedModels = localStorage.getItem('comparison-selected-models');
      const savedInput = localStorage.getItem('comparison-input-value');
      const savedTool = localStorage.getItem('comparison-selected-tool');
      
      if (savedResponses) {
        try {
          const parsedResponses = JSON.parse(savedResponses);
          // Convert timestamp strings back to Date objects
          const responsesWithDates = parsedResponses.map((response: any) => ({
            ...response,
            timestamp: new Date(response.timestamp)
          }));
          setResponses(responsesWithDates);
        } catch (error) {
          console.error('Error loading responses from localStorage:', error);
        }
      }
      
      if (savedModels) {
        try {
          const parsedModels = JSON.parse(savedModels);
          if (Array.isArray(parsedModels) && parsedModels.length >= 2) {
            setSelectedModels(parsedModels);
          }
        } catch (error) {
          console.error('Error loading models from localStorage:', error);
        }
      }
      
      if (savedInput) {
        setInputValue(savedInput);
      }
      
      if (savedTool) {
        setSelectedTool(savedTool);
      }
    }
  }, [initialComparison]);

  // Save data to localStorage whenever they change
  useEffect(() => {
    if (responses.length > 0) {
      localStorage.setItem('comparison-responses', JSON.stringify(responses));
    }
  }, [responses]);

  useEffect(() => {
    localStorage.setItem('comparison-selected-models', JSON.stringify(selectedModels));
  }, [selectedModels]);

  useEffect(() => {
    localStorage.setItem('comparison-input-value', inputValue);
  }, [inputValue]);

  useEffect(() => {
    localStorage.setItem('comparison-selected-tool', selectedTool);
  }, [selectedTool]);

  // Initialize with comparison data if provided
  useEffect(() => {
    if (initialComparison) {
      // Set the input to the original prompt
      setInputValue(initialComparison.prompt);
      
      // Set models: left model from chat, right model as different one
      const rightModel = initialComparison.leftModel === 'Gemini Pro' ? 'GPT-3.5 Turbo' : 'Gemini Pro';
      setSelectedModels([initialComparison.leftModel, rightModel]);
      
      // Pre-populate left response and trigger right response
      const leftResponse: ComparisonResponse = {
        model: initialComparison.leftModel,
        content: initialComparison.leftResponse,
        timestamp: new Date(),
      };
      
      setResponses([leftResponse]);
      setNewestResponseIds(new Set([rightModel])); // Only mark right model as new
      setIsLoading(true);
      
      // Get response from the right model
      setTimeout(async () => {
        let rightContent = '';
        
        try {
          if (rightModel === 'Gemini Pro') {
            const response = await sendMessageToGemini(initialComparison.prompt);
            rightContent = response.error || response.content;
          } else if (rightModel === 'GPT-3.5 Turbo' || rightModel === 'GPT-4') {
            const response = await sendMessageToOpenAI(initialComparison.prompt);
            rightContent = response.error || response.content;
          } else {
            rightContent = `API Limit reached. Come back later.`;
          }
        } catch (error) {
          rightContent = `Error getting response from ${rightModel}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
        
        const rightResponse: ComparisonResponse = {
          model: rightModel,
          content: rightContent,
          timestamp: new Date(),
        };
        
        setResponses(prev => [...prev, rightResponse]);
        setIsLoading(false);
      }, 1000);
    }
  }, [initialComparison]);

  // Auto-scroll to bottom when responses change
  useEffect(() => {
    if (responses.length > 0) {
      resultsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [responses]);

  const addModel = () => {
    if (selectedModels.length < 4) {
      const availableModel = availableModels.find(model => !selectedModels.includes(model));
      if (availableModel) {
        setSelectedModels([...selectedModels, availableModel]);
      }
    }
  };

  const removeModel = (index: number) => {
    if (selectedModels.length > 2) {
      setSelectedModels(selectedModels.filter((_, i) => i !== index));
    }
  };

  const updateModel = (index: number, newModel: string) => {
    const newModels = [...selectedModels];
    newModels[index] = newModel;
    setSelectedModels(newModels);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setResponses([]);
    setNewestResponseIds(new Set(selectedModels)); // Mark all models as having new responses

    // Store the current input value before clearing
    const currentInput = inputValue;
    setInputValue('');

    // Get actual responses from each model
    for (let i = 0; i < selectedModels.length; i++) {
      const model = selectedModels[i];
      
      setTimeout(async () => {
        let content = '';
        
        try {
          if (selectedTool === 'chat') {
            // Route to appropriate API based on model
            if (model === 'Gemini Pro') {
              const response = await sendMessageToGemini(currentInput);
              content = response.error || response.content;
            } else if (model === 'GPT-3.5 Turbo' || model === 'GPT-4') {
              const response = await sendMessageToOpenAI(currentInput);
              content = response.error || response.content;
            } else {
              // For other models (Claude, Llama), use a placeholder response with delay
              await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
              content = `API Limit reached. Come back later.`;
            }
          } else {
            content = `${selectedTool} generation result from ${model} for: "${currentInput}" - Feature coming soon!`;
          }
        } catch (error) {
          content = `Error getting response from ${model}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
        
        const response: ComparisonResponse = {
          model: model,
          content: content,
          timestamp: new Date(),
        };
        
        setResponses(prev => [...prev, response]);
        
        if (i === selectedModels.length - 1) {
          setIsLoading(false);
          // Focus the textarea after responses are complete
          if (textareaRef.current) {
            textareaRef.current.focus();
          }
        }
      }, (i + 1) * 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-purple-200/50">
        <h2 className="text-xl font-medium text-gray-800 tracking-tighter mb-4">
          Comparison Mode
        </h2>
        
        {/* Tool Selection */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-medium text-gray-600 tracking-tighter">Tool:</span>
          <div className="flex gap-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                disabled={tool.isPro}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200
                  ${selectedTool === tool.id 
                    ? 'neuro-button text-purple-700 shadow-[0_0_15px_rgba(163,116,255,0.4)]' 
                    : 'glass-card text-gray-600 hover:text-purple-600'
                  }
                  ${tool.isPro ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <tool.icon className="w-4 h-4" />
                {tool.name}
                {tool.isPro && <span className="text-xs font-bold text-purple-500">{tool.label || 'PRO'}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Model Selectors */}
        <div className="flex items-center gap-3 flex-wrap">
          {selectedModels.map((model, index) => (
            <div key={index} className="flex items-center gap-2">
              <ModelSelector
                selectedModel={model}
                onModelChange={(newModel) => updateModel(index, newModel)}
                models={availableModels}
              />
              {selectedModels.length > 2 && (
                <button
                  onClick={() => removeModel(index)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {selectedModels.length < 4 && (
            <button
              onClick={addModel}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-purple-600 font-semibold transition-all duration-200 hover:bg-purple-50/50 hover:shadow-[0_0_10px_rgba(163,116,255,0.2)]"
            >
              <PlusIcon className="w-4 h-4" />
              Add Model
            </button>
          )}
        </div>
      </div>

      {/* Comparison Results */}
      <div className="flex-1 overflow-y-auto p-6">
        {responses.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center w-full max-w-2xl mx-auto">
              <h3 className="text-2xl font-medium text-gray-800 mb-2 tracking-tighter">
                Compare AI Models Side by Side
              </h3>
              <p className="text-gray-600 opacity-70 mb-8">
                Send a prompt to see how different models respond
              </p>
              
              {/* Centered Input Area when no responses */}
              <div className="glass-card rounded-2xl p-4 w-full border border-purple-200/50 shadow-sm">
                <div className="flex gap-3 items-end">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Enter your ${selectedTool === 'chat' ? 'prompt' : `${selectedTool} generation prompt`} to compare across models...`}
                    className="flex-1 bg-gray-100/90 border border-purple-200/50 rounded-lg px-3 py-2 outline-none resize-none text-gray-700 placeholder-gray-500 opacity-80 min-h-[2.5rem] max-h-24 overflow-y-auto focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 [caret-color:purple-600] [caret-width:2px]"
                    rows={1}
                    style={{ height: 'auto', maxHeight: '6rem' }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      const newHeight = Math.min(target.scrollHeight, 96); // 96px = 6rem = 4 lines
                      target.style.height = newHeight + 'px';
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="neuro-button p-3 rounded-xl text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed h-12 w-12 flex items-center justify-center"
                  >
                    <SendIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4" style={{gridTemplateColumns: `repeat(${selectedModels.length}, 1fr)`}}>
            {selectedModels.map((model, index) => (
              <div key={model} className="glass-card p-6 rounded-2xl">
                <h4 className="font-medium text-purple-700 mb-4 tracking-tighter">{model}</h4>
                {responses.find(r => r.model === model) ? (
                  <div className="text-gray-700 opacity-80">
                    <TypewriterMarkdown 
                      text={responses.find(r => r.model === model)?.content || ''} 
                      speed={4} 
                      isNewMessage={newestResponseIds.has(model)}
                    />
                  </div>
                ) : isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-purple-200 rounded mb-2"></div>
                    <div className="h-4 bg-purple-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-purple-200 rounded w-1/2"></div>
                  </div>
                ) : (
                  <div className="text-gray-400 opacity-60">Waiting for prompt...</div>
                )}
              </div>
            ))}
            {/* Auto-scroll anchor */}
            <div ref={resultsEndRef} />
          </div>
        )}
      </div>

      {/* Bottom Input Area - only show when there are responses */}
      {responses.length > 0 && (
        <div className="p-6 border-t border-purple-200/50 bg-gradient-to-r from-purple-50/50 via-purple-50/40 to-purple-50/50">
          <div className="glass-card rounded-2xl p-4 border border-purple-200/50 shadow-sm w-full max-w-2xl mx-auto">
            <div className="flex gap-3 items-end">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Enter your ${selectedTool === 'chat' ? 'prompt' : `${selectedTool} generation prompt`} to compare across models...`}
                className="flex-1 bg-gray-100/90 border border-purple-200/50 rounded-lg px-3 py-2 outline-none resize-none text-gray-700 placeholder-gray-500 opacity-80 min-h-[2.5rem] max-h-24 overflow-y-auto focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 [caret-color:purple-600] [caret-width:2px]"
                rows={1}
                style={{ height: 'auto', maxHeight: '6rem' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  const newHeight = Math.min(target.scrollHeight, 96); // 96px = 6rem = 4 lines
                  target.style.height = newHeight + 'px';
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="neuro-button p-3 rounded-xl text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonInterface;
