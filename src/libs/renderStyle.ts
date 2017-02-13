import applyPlugins from '../plugins';
import generateCSSDeclaration from './generateCSSDeclaration';
import renderCSSText from './renderCSSText';
import generateClassName from './generateClassName';
import { Style } from '../types';

export default function renderStyle(
  keys: string[],
  style: Style,
  classNames: string[],
  classNamesForModes: {[key: string]: string},
  pseudo = '',
  medias: string[] = [],
  parentProperty: string|null = null,
) {
  style = applyPlugins(style);

  let declarations: string[] = [];
  for (const property in style) {
    const value = style[property];

    const isPseudo = isPropertyPseudo(property);
    const isMediaQuery = isPropertyMediaQuery(property);
    const isMode = isPropertyMode(property);

    if (parentProperty && !isPseudo && !isMediaQuery && !isMode) {
        throw new Error(`Ambigious property, is it ${parentProperty} or ${property} ` +
                        `with value of ${JSON.stringify(value)}`);
    }

    let currentKeys = keys;
    let currentClassNames = classNames;
    let currentPseudo = pseudo;
    let currentMedias = medias;

    if (isPseudo) {
      currentPseudo = pseudo + property;

    } else if (isMediaQuery) {
      currentMedias = medias.concat(property.slice(6).trim());

    } else if (isMode) {
      const mode = property.slice(1);
      currentKeys = keys.concat(mode);
      let modeClassName = classNamesForModes[mode];
      if (!modeClassName) {
        modeClassName = classNamesForModes[mode] = generateClassName(currentKeys);
      }
      currentClassNames = classNames.concat(`.${modeClassName}`);
    }

    if (value instanceof Object && !Array.isArray(value)) {
      // Render all previous declarations as we will now be in a new selector
      renderToNode(classNames, pseudo, medias, declarations);
      declarations = [];
      const currentProperty = !isPseudo && !isMediaQuery && !isMode
        ? property
        : parentProperty;

      renderStyle(
        currentKeys,
        value as Style,
        currentClassNames,
        classNamesForModes,
        currentPseudo,
        currentMedias,
        currentProperty,
      );

    } else {
      if ((isPseudo || isMediaQuery || isMode) && !parentProperty) {
        throw new Error(`No CSS property provided, just a selector ${property} for value ${JSON.stringify(value)}`);
      }

      // We can assert that if parentProperty then declarations.length === 0
      // because all siblings must be pseudo, mode or mediaquery,
      // which all reset declarations to []

      if (Array.isArray(value)) {
        value.forEach(val => declarations.push(generateCSSDeclaration(parentProperty || property, val)));
      } else {
        declarations.push(generateCSSDeclaration(parentProperty || property, value));
      }

      // Since the value is under a new selector, render it
      if (parentProperty) {
        renderToNode(currentClassNames, currentPseudo, currentMedias, declarations);
        declarations = [];
      }
    }
  }
  renderToNode(classNames, pseudo, medias, declarations);
}

function renderToNode(classNames: string[], pseudo: string, medias: string[], declarations: string[]) {
  if (!declarations.length) return;
  const selector = generateCSSSelector(classNames, pseudo);
  const media = generateCombinedMediaQuery(medias);
  const cssRule = generateCSSRule(selector, declarations.join(';'), media);

  renderCSSText(cssRule);
}

function isPropertyPseudo(property: string) {
  return property.charAt(0) === ':';
}

function isPropertyMediaQuery(property: string) {
  return property.substr(0, 6) === '@media';
}

function isPropertyMode(property: string) {
  return property.charAt(0) === '$';
}

export function generateCSSSelector(classNames: string[], pseudo = '') {
  return `${classNames.join('')}${pseudo}`;
}

export function generateCSSRule(selector: string, cssDeclaration: string, mediaQuery: string|null) {
  let rule = `${selector}{${cssDeclaration}}`;
  if (mediaQuery) {
    rule = `${mediaQuery}{${rule}}`;
  }
  return rule;
}

export function generateCombinedMediaQuery(medias: string[]) {
  if (medias.length === 0) {
    return null;
  }
  return `@media ${medias.join(' and ')}`;
}
