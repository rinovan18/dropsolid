import React from 'react';

// ** Twig templates
import pageHomeTwig from './demo--home.twig';

const merge = require('deepmerge');

// ** import of data

import pageData from '../../05-pages/00-styleguide/page.yml';
import homePageData from './demo--home.yml';
// import visualData from '../../02-molecules/visual/styleguide/visual.yml';
// import visualHomeData from '../../02-molecules/visual/styleguide/visual-home.yml';
// import uspData from '../../02-molecules/usp/styleguide/usp.yml';
// import uspHomeData from '../../02-molecules/usp/styleguide/usp-home.yml';
// import contentData from '../../02-molecules/content/styleguide/content.yml';
// import contentHomeData from '../../02-molecules/content/styleguide/content-home.yml';

// import blogViewHomeData from '../../../02-features/f002-blog/03-organisms/styleguide/blog-overview-home.yml';
// import eventViewHomeData from '../../../02-features/f014-event/03-organisms/styleguide/event-overview-home.yml';

// ** The modified Data imports from in Pages (eg. 'pageData')
//    are still available in their modified state in here, when imported
//    so we don't have to import and merge ALL the data again
//    we just need to import the highers level and merge with our demo data

// ** Merge into homepage data

var myHomePageData = merge(pageData  || {}, homePageData || {});

// ** Add blocks data to it

// myHomePageData.page.content.blocks.visual = merge(visualHomeData  || {}, visualData || {});
// myHomePageData.page.content.blocks.usp = merge(uspHomeData  || {}, uspData || {});
// myHomePageData.page.content.blocks.content = merge(contentHomeData  || {}, contentData || {});

// myHomePageData.page.content.blocks.blog.overview = blogViewHomeData
// myHomePageData.page.content.blocks.event.overview = eventViewHomeData;

// ** Styling for Storybook only

import '../../05-pages/00-styleguide/pages.scss';


// ** libraries

import '../../02-molecules/menus/menu/menu--dropdown.js'
import '../../02-molecules/menus/menu--language/menu--language.js'


// ** documentation
import mdx from './demo.mdx';


/**
 * Storybook Definition.
 */
export default {
  title: 'Demo/Pages',
  parameters: { docs: { page: mdx } }, // needed to load an mdx file for documentation: componentName.mdx
};

export const Homepage = () => (
  <div dangerouslySetInnerHTML={{ __html: pageHomeTwig(myHomePageData) }} />
);
