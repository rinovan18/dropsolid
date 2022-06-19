import React from 'react';

import videoTwig from './video.twig';

import videoData from './video.yml';

// documentation
import mdx from './videos.mdx';

/**
 * Storybook Definition.
 */
export default {
  title: 'Atoms/Video',
  parameters: { docs: { page: mdx } }, // needed to load an mdx file for documentation: componentName.mdx
};


export const YoutubeVideo = () => (
  <div dangerouslySetInnerHTML={{ __html: videoTwig(videoData) }} />
);
