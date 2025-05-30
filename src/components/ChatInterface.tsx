import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './ui/icons';
import ModelSelector from './ModelSelector';
import { sendMessageToGemini } from '../services/gemini';
import { sendMessageToOpenAI } from '../services/openai';
import TypewriterMarkdown from './TypewriterMarkdown';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  error?: string;
  modelName?: string;
}

interface ChatInterfaceProps {
  isComparison?: boolean;
  selectedModels?: string[];
  onStartComparison?: (comparisonData?: {
    prompt: string;
    leftModel: string;
    leftResponse: string;
  }) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  isComparison = false, 
  selectedModels = [], 
  onStartComparison 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('Gemini Pro');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [newestMessageId, setNewestMessageId] = useState<string | null>(null);
  
  const availableModels = ['GPT-3.5 Turbo', 'GPT-4', 'Gemini Pro', 'Claude-3', 'Llama-2'];
  const hasMessages = messages.length > 0;

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-messages');
    const savedModel = localStorage.getItem('chat-selected-model');
    
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Error loading messages from localStorage:', error);
      }
    }
    
    if (savedModel && availableModels.includes(savedModel)) {
      setSelectedModel(savedModel);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Save selected model to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chat-selected-model', selectedModel);
  }, [selectedModel]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    const currentInput = inputValue;
    setInputValue('');

    try {
      let response;
      
      // Route to appropriate API based on selected model
      if (selectedModel === 'Gemini Pro') {
        response = await sendMessageToGemini(currentInput);
      } else if (selectedModel === 'GPT-3.5 Turbo' || selectedModel === 'GPT-4') {
        response = await sendMessageToOpenAI(currentInput);
      } else {
        // For other models (Claude, Llama), use a placeholder response with delay
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
        response = {
          content: `API Limit reached. Come back later.`,
          error: null
        };
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.error || response.content,
        role: 'assistant',
        timestamp: new Date(),
        error: response.error,
        modelName: selectedModel
      };
      
      setNewestMessageId(aiMessage.id);
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your request.',
        role: 'assistant',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        modelName: selectedModel
      };
      setNewestMessageId(errorMessage.id);
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Focus the textarea after the response is complete
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCompareResponse = (messageId: string) => {
    // Find the user message that prompted this AI response
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    const aiMessage = messages[messageIndex];
    
    if (messageIndex > 0 && aiMessage) {
      const userMessage = messages[messageIndex - 1];
      if (userMessage.role === 'user' && aiMessage.role === 'assistant' && onStartComparison) {
        // Pass the comparison data to pre-populate the comparison interface
        onStartComparison({
          prompt: userMessage.content,
          leftModel: aiMessage.modelName || selectedModel,
          leftResponse: aiMessage.content
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex flex-col p-6 border-b border-purple-200/50">
        <h2 className="text-xl font-medium text-gray-800 tracking-tighter mb-4">
          Chat
        </h2>
        {!isComparison && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 tracking-tighter">Model:</span>
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              models={availableModels}
            />
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto ${hasMessages ? 'p-6' : 'p-6 flex items-center justify-center'}`}>
        {!hasMessages ? (
          <div className="text-center w-full max-w-2xl mx-auto">
            <h3 className="text-2xl font-medium text-gray-800 mb-2 tracking-tighter">
              How can I help you today?
            </h3>
            <p className="text-gray-600 opacity-70 mb-8">
              Start a conversation with our AI assistant
            </p>
            
            {/* Centered Input Area when no messages */}
            <div className="glass-card rounded-2xl p-4 w-full">
              <div className="flex gap-3 items-end">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-100/90 border border-purple-200/50 rounded-lg px-3 py-2 outline-none resize-none text-gray-700 placeholder-gray-500 opacity-80 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 [caret-color:purple-600] [caret-width:2px]"
                  rows={1}
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
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-2xl ${message.role === 'user' ? '' : 'w-full'}`}>
                  {/* Model name for assistant messages */}
                  {message.role === 'assistant' && message.modelName && (
                    <div className="text-xs text-gray-500 mb-1 px-2 font-medium">
                      {message.modelName}
                    </div>
                  )}
                  <div
                    className={`
                      p-4 rounded-2xl
                      ${message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                        : message.error
                          ? 'bg-red-50 text-red-700'
                          : 'glass-card text-gray-700'
                      }
                    `}
                  >
                    {message.role === 'assistant' ? (
                      <TypewriterMarkdown 
                        text={message.content} 
                        speed={4} 
                        className="opacity-90" 
                        isNewMessage={message.id === newestMessageId}
                      />
                    ) : (
                      <p className="opacity-90">{message.content}</p>
                    )}
                  </div>
                  
                  {/* Compare CTA below assistant messages */}
                  {message.role === 'assistant' && !isComparison && onStartComparison && !message.error && (
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={() => handleCompareResponse(message.id)}
                        className="neuro-button px-6 py-3 rounded-xl text-purple-700 font-medium"
                      >
                        Compare the response with other AI models
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* Loading skeleton */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-2xl w-full">
                  <div className="text-xs text-gray-500 mb-1 px-2 font-medium">
                    {selectedModel}
                  </div>
                  <div className="glass-card p-4 rounded-2xl">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-purple-200/50 rounded w-3/4"></div>
                      <div className="h-4 bg-purple-200/50 rounded"></div>
                      <div className="h-4 bg-purple-200/50 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Input Area - only show when there are messages */}
      {hasMessages && (
        <div className="p-6 border-t border-purple-200/50">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex gap-3 items-end">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-gray-100/90 border border-purple-200/50 rounded-lg px-3 py-2 outline-none resize-none text-gray-700 placeholder-gray-500 opacity-80 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 [caret-color:purple-600] [caret-width:2px]"
                rows={1}
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

export default ChatInterface;
