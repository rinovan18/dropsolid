import React from 'react';

import imageTwig from '../00-image/_image.twig';
import blazyTwig from './blazy.twig';
import blazyResponsiveTwig from './blazy-responsive.twig';
import imageResponsive from '../00-image/_image--responsive.twig';
import iconTwig from './icons.twig';
import figureTwig from './figure.twig';
import figuresTwig from './figures.twig';
import imagesTwig from './images.twig';

import iconData from './icons.yml';
import imageData from './image.yml';
import blazyData from './blazy.yml';
import blazyResponsiveData from './blazy-responsive.yml';
import imageResponsiveData from './image-responsive.yml';
import imageResponsivePictureData from './image-responsive-picture.yml';
import figureData from './figure.yml';
import figuresCKEData from './figures.yml';
import imagesCKEData from './images.yml';


// import library files
import '../icons/svgxuse.min.js';
import './blazy.load.js';


// documentation
import mdx from './images.mdx';

/**
 * Storybook Definition.
 */
export default {
  title: 'Atoms/Images',
  parameters: { docs: { page: mdx } }, // needed to load an mdx file for documentation: componentName.mdx
};

export const CustomIcons = () => (
  <div dangerouslySetInnerHTML={{ __html: iconTwig(iconData) }} />
);

export const Image = () => (
  <div dangerouslySetInnerHTML={{ __html: imageTwig(imageData) }} />
);

export const BlazyImage = () => (
  <div dangerouslySetInnerHTML={{ __html: blazyTwig(blazyData) }} />
);

export const ResponsiveImage = () => (
  <div dangerouslySetInnerHTML={{ __html: imageResponsive(imageResponsiveData) }} />
);

export const ResponsivePicture = () => (
  <div dangerouslySetInnerHTML={{ __html: imageResponsive(imageResponsivePictureData) }} />
);

export const BlazyResponsiveImage = () => (
  <div dangerouslySetInnerHTML={{ __html: blazyResponsiveTwig(blazyResponsiveData) }} />
);

export const Figure = () => (
  <div dangerouslySetInnerHTML={{ __html: figureTwig(figureData) }} />
);

export const ImagesInCKE = () => (
  <div dangerouslySetInnerHTML={{ __html: imagesTwig(imagesCKEData) }} />
);

export const FiguresInCKE = () => (
  <div dangerouslySetInnerHTML={{ __html: figuresTwig(figuresCKEData) }} />
);
