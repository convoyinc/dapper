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
  pseudo: string,
  medias: string[],
) {
  style = applyPlugins(style);

  let declarations: string[] = [];
  for (const property in style) {
    const value = style[property];
    if (value instanceof Object && !Array.isArray(value)) {
      // Render all previous items
      renderToNode(classNames, pseudo, medias, declarations);
      declarations = [];

      if (isPseudo(property)) {
        renderStyle(keys, value as Style, classNames, classNamesForModes, pseudo + property, medias);

      } else if (isMediaQuery(property)) {
        const media = property.slice(6).trim();
        renderStyle(keys, value as Style, classNames, classNamesForModes, pseudo, medias.concat(media));

      } else if (isMode(property)) {
        const mode = property.slice(1);
        const newKeys = keys.concat(mode);
        let modeClassName = classNamesForModes[mode];
        if (!modeClassName) {
          modeClassName = classNamesForModes[mode] = generateClassName(newKeys);
        }
        renderStyle(
          newKeys,
          value as Style,
          classNames.concat(modeClassName),
          classNamesForModes,
          pseudo,
          medias,
        );

      } else {
        throw new Error(`Invalid style for property ${property}: ${value}`);
      }
    } else if (Array.isArray(value)) {
      value.map(val => declarations.push(generateCSSDeclaration(property, val)));
    } else {
      declarations.push(generateCSSDeclaration(property, value));
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

function isPseudo(property: string) {
  return property.charAt(0) === ':';
}

function isMediaQuery(property: string) {
  return property.substr(0, 6) === '@media';
}

function isMode(property: string) {
  return property.charAt(0) === '$';
}

export function generateCSSSelector(classNames: string[], pseudo = '') {
  return `${classNames.map(cn => `.${cn}`).join('')}${pseudo}`;
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
