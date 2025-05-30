
import React from 'react';
import { CrownIcon } from './ui/icons';

interface ProFeaturePageProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ProFeaturePage: React.FC<ProFeaturePageProps> = ({ title, description, icon: Icon }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-purple-200/50">
        <h2 className="text-xl font-medium text-gray-800 tracking-tighter flex items-center gap-2">
          <Icon className="w-6 h-6" />
          {title}
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="glass-card p-8 rounded-3xl">
            <CrownIcon className="w-16 h-16 text-purple-500 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-gray-800 mb-4 tracking-tighter">
              Pro Feature
            </h3>
            <p className="text-gray-600 opacity-80 mb-6">
              {description}
            </p>
            <button className="neuro-button px-8 py-3 rounded-xl text-purple-700 font-medium animate-glow">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProFeaturePage;
