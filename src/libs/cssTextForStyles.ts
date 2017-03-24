import * as _ from 'lodash';

import applyPlugins from '../plugins';
import generateCSSDeclaration from './generateCSSDeclaration';
import { StyleRule, StyleDeclaration } from '../types';

interface ValueAndPath {
  path: string[];
  value: string|number;
}

// Given LESS-like styles { '.className': { '&.modeClassName': { fontSize: 5 }}}
// Returns CSS text to render
export default function cssTextForStyles(styles: StyleDeclaration): string[] {
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
    let parentSelectors: string[] = [];
    const medias: string[] = [];
    let pseudos: string[] = [];

    path.reverse().forEach(key => {
      const isPseudo = isPropertyPseudo(key);
      const isMediaQuery = isPropertyMediaQuery(key);
      const isParentSelector = isPropertyParentSelector(key);

      if (isParentSelector) {
        parentSelectors.push(key.slice(1).trim());

      } else if (isPseudo) {
        pseudos.push(key);

      } else if (isMediaQuery) {
        medias.push(key.slice(6).trim());

      } else if (property) {
        selector = `${key}${parentSelectors.join('')}${pseudos.reverse().join('')} ` + selector;
        parentSelectors = [];
        pseudos = [];

      } else {
        property = key;

      }
    });

    if (!property) {
      throw new Error(`No CSS property provided, just selector ${selector} for value ${JSON.stringify(value)}`);
    }

    if (!selector) {
      throw new Error(`No CSS selector provided, just property ${property} for value ${JSON.stringify(value)}`);
    }

    const declaration = generateCSSDeclaration(property, value);

    return {
      selector: selector.trim(),
      declaration,
      media: generateCombinedMediaQuery(medias.reverse()),
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

function isPropertyPseudo(property: string) {
  return property.charAt(0) === ':';
}

function isPropertyMediaQuery(property: string) {
  return property.substr(0, 6) === '@media';
}

function isPropertyParentSelector(property: string) {
  return property.charAt(0) === '&';
}
