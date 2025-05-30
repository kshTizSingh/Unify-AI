
import React from 'react';
import ProFeaturePage from '../components/ProFeaturePage';
import { VideoIcon } from '../components/ui/icons';

const VideoGeneration: React.FC = () => {
  return (
    <ProFeaturePage
      title="Video Generation"
      description="Generate amazing videos using cutting-edge AI technology. Upgrade to Pro to access this premium feature."
      icon={VideoIcon}
    />
  );
};

export default VideoGeneration;
