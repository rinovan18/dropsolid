import React from 'react';

import paragraphsTwig from './paragraphs.twig';

import paragraphsData from './paragraphs.yml';

// import libaries
import '../../../../00-theme/01-atoms/04-images/styleguide/blazy.load.js';


// documentation
import mdx from './paragraphs.mdx';

/**
 * Storybook Definition.
 */
export default {
  title: 'Organisms/Paragraphs/Base',
  parameters: { docs: { page: mdx } }, // needed to load an mdx file for documentation: componentName.mdx
};

export const styles = () => (
  <div dangerouslySetInnerHTML={{ __html: paragraphsTwig(paragraphsData) }} />
);
