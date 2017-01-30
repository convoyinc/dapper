import * as _ from 'lodash';
import * as hyphenateStyleName from 'hyphenate-style-name';

import { _renderToNode } from './render-to';

export type CompiledStyleSheet<Keys extends string> = {
  [Key in Keys]: CompiledStyle;
};

export type CompiledStyle = string | StyleReducer;

export type ModeResolver = {[key: string]: boolean};

export type StyleReducer = (modes: ModeResolver) => string;

export type Style = {[key: string]: string|Object};

let uniqueRuleIdentifier = 0;

export default function create<Styles extends Object>(
  styles: Styles,
): CompiledStyleSheet<keyof Styles> {
  return _.mapValues(styles, style => renderStyleToReducer(style)) as any;
}

function renderStyleToReducer(style: Style) {
  const classNames = [generateClassName(++uniqueRuleIdentifier)];
  const classNamesForModes = {};
  renderStyle(style, classNames, classNamesForModes, '', []);
  return getCompiledStyle(classNames, classNamesForModes);
}

function renderStyle(
  style: Style,
  classNames: string[],
  classNamesForModes: {[key: string]: string},
  pseudo: string,
  medias: string[],
) {

  const declarations = [];
  for (const property in style) {
    const value = style[property];
    if (value instanceof Object) {
      if (isPseudo(property)) {
        renderStyle(value as Style, classNames, classNamesForModes, pseudo + property, medias);

      } else if (isMediaQuery(property)) {
        const media = property.slice(6).trim();
        renderStyle(value as Style, classNames, classNamesForModes, pseudo + property, medias.concat(media));

      } else if (isMode(property)) {
        const mode = property.slice(1);
        let modeClassName = classNamesForModes[mode];
        if (!modeClassName) {
          modeClassName = classNamesForModes[mode] = generateClassName(++uniqueRuleIdentifier);
        }
        renderStyle(value as Style, classNames.concat(modeClassName), classNamesForModes, pseudo, medias);

      } else {
        throw new Error(`Invalid style for property ${property}`);
      }
    } else {
      const cssDeclaration = generateCSSDeclaration(property, value);
      declarations.push(cssDeclaration);
    }
  }

  const selector = generateCSSSelector(classNames, pseudo);
  const media = generateCombinedMediaQuery(medias);
  const cssRule = generateCSSRule(selector, declarations.join(';'), media);
  _renderToNode(cssRule);
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

function getCompiledStyle(classNames: string[], classNamesForModes: {[key: string]: string}) {
  if (!Object.keys(classNamesForModes).length) {
    return classNames.join(' ');
  } else {
    return function styleReducer(modes: ModeResolver) {
      const names = classNames.slice(0);
      for (const mode in modes) {
        if (modes[mode]) {
          names.push(classNamesForModes[mode]);
        }
      }
      return names.join(' ');
    };
  }
}

const CHARS = 'abcdefghijklmnopqrstuvwxyz';
const CHAR_LENGTH = CHARS.length;

function generateClassName(id: number, className = ''): string {
  if (id <= CHAR_LENGTH) {
    return CHARS[id - 1] + className;
  }

  // Bitwise floor as safari performs much faster https://jsperf.com/math-floor-vs-math-round-vs-parseint/55
  return generateClassName(id / CHAR_LENGTH | 0, CHARS[id % CHAR_LENGTH] + className);
}

export function generateCSSDeclaration(property: string, value: string|number) {
  return `${hyphenateStyleName(property)}:${value}`;
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
