import * as _ from 'lodash';

import applyPlugins from '../plugins';
import generateCSSDeclaration from './generateCSSDeclaration';
import { StyleRule, StyleDeclaration } from '../types';

interface ValueAndPath {
  path: string[];
  value: string|number;
}

const CSS_PROPERTY_REGEX = /-?[_a-zA-Z]+[_a-zA-Z0-9-]*/;

// Given LESS-like styles { '.className': { '&.modeClassName': { fontSize: 5 }}}
// Returns CSS text to render
export default function cssTextForStyles(styles: StyleDeclaration<string>): string[] {
  const valueAndPaths: ValueAndPath[] = [];
  _.forEach(styles, (style, key: string) => {
    if (typeof style !== 'object') {
      throw new Error(`No CSS selector provided, just property ${key} with value ${JSON.stringify(style)}`);
    }
    style = applyPlugins(style);
    valueAndPaths.push(...valueAndPathForStyle(style, [key]));
  });

  return cssRuleForValueAndPaths(valueAndPaths);
}

// Gets a list of values and their key paths
function valueAndPathForStyle(style: StyleRule, keys: string[]) {
  const valueAndPaths: ValueAndPath[] = [];

  for (const key in style) {
    const value = style[key];

    const path = keys.concat(key);

    if (typeof value === 'object' && !Array.isArray(value)) {
      valueAndPaths.push(...valueAndPathForStyle(value as StyleRule, path));

    } else {
      if (Array.isArray(value)) {
        value.forEach(val => valueAndPaths.push({path: path.slice(0), value: val}));
      } else {
        valueAndPaths.push({path, value});
      }
    }
  }

  return valueAndPaths;
}

function cssRuleForValueAndPaths(valueAndPaths: ValueAndPath[]) {
  const selectorDeclarations = valueAndPaths.map(valueAndPath => {
    const { path, value } = valueAndPath;
    let property: string|null = null;
    let selector = '';
    const medias: string[] = [];

    // Finds the last key which could be a css property
    let index = path.length - 1;
    for (; index >= 0; index--) {
      const key = path[index];
      if (CSS_PROPERTY_REGEX.test(key)) {
        property = key;
        break;
      }
    }

    if (!property) {
      throw new Error(`No CSS property provided, just selectors ${path.join(', ')} for value ${JSON.stringify(value)}`);
    }

    // Remove the css property
    path.splice(index, 1);

    // Build up the selector
    path.forEach(key => {
      if (hasParentSelector(key)) {
        selector = key.replace(/\&/g, selector);

      } else if (isMediaQuery(key)) {
        medias.push(key.slice(6).trim());

      } else if (isPseudoSelector(key)) {
        selector += key;

      } else {
        selector += selector ? ` ${key}` : key;
      }
    });

    if (!selector) {
      throw new Error(`No CSS selector provided, just property ${property} for value ${JSON.stringify(value)}`);
    }

    const declaration = generateCSSDeclaration(property, value);

    return {
      selector,
      declaration,
      media: generateCombinedMediaQuery(medias),
    };
  });

  const cssTexts: string[] = [];
  let lastSelector: string|null = null;
  let lastMedia: string|null = null;
  let declarations: string[] = [];
  selectorDeclarations.forEach((selectorDeclaration, index) => {
    const { selector, declaration, media } = selectorDeclaration;

    if (lastSelector && (lastSelector !== selector || media !== lastMedia)) {
      cssTexts.push(cssRuleForDeclarations(lastSelector, lastMedia, declarations));
      declarations = [];
    }

    declarations.push(declaration);

    if (index === selectorDeclarations.length - 1) {
      cssTexts.push(cssRuleForDeclarations(selector, media, declarations));
    }

    lastMedia = media;
    lastSelector = selector;
  });
  return cssTexts;
}

function cssRuleForDeclarations(selector: string, media: string|null, declarations: string[]) {
  let rule = `${selector}{${declarations.join(';')}}`;

  if (media) {
    rule = `${media}{${rule}}`;
  }
  return rule;
}

function generateCombinedMediaQuery(medias: string[]) {
  if (medias.length === 0) {
    return null;
  }
  return `@media ${medias.join(' and ')}`;
}

export function isPseudoSelector(property: string) {
  return property.charAt(0) === ':';
}

function isMediaQuery(property: string) {
  return property.substr(0, 6) === '@media';
}

function hasParentSelector(property: string) {
  return property.indexOf('&') !== -1;
}
