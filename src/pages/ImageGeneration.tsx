
import React from 'react';
import ProFeaturePage from '../components/ProFeaturePage';
import { ImageIcon } from '../components/ui/icons';

const ImageGeneration: React.FC = () => {
  return (
    <ProFeaturePage
      title="Image Generation"
      description="Create stunning AI-generated images with advanced models. Upgrade to Pro to unlock this powerful creative tool."
      icon={ImageIcon}
    />
  );
};

export default ImageGeneration;
