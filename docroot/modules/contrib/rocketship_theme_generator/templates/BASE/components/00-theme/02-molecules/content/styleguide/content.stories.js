import React from 'react';

import contentTwig from './content.twig';

import contentData from './content.yml';
import contentHomeData from './content-home.yml';

// import libaries
// import '../../01-atoms/04-images/styleguide/blazy.load.js';


// documentation
import mdx from './content.mdx';

/**
 * Storybook Definition.
 */
export default {
  title: 'Molecules/Content',
  parameters: { docs: { page: mdx } }, // needed to load an mdx file for documentation: componentName.mdx
};

export const contentBlockOnHomepage = () => (
  <div dangerouslySetInnerHTML={{ __html: contentTwig({...contentData, ...contentHomeData}) }} />
);
