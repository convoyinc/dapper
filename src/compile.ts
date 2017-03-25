import generateClassName from './libs/generateClassName';
import cssTextForStyles, { isPropertyPseudo } from './libs/cssTextForStyles';
import renderCSSText from './libs/renderCSSText';
import {
  ActiveModes,
  CompiledStyleSheet,
  StyleDeclaration,
  StyleRule,
} from './types';

const PLACEHOLDER_REGEX = /\{([^\}]+)\}/g;

export default function compile<StyleSet extends StyleDeclaration>(
  styles: StyleSet,
): CompiledStyleSheet<keyof StyleSet> {
  const {
    styles: newStyles,
    compiledStyles,
  } = setClassNamesForStyleDeclaration<CompiledStyleSheet<keyof StyleSet>>(styles);
  const cssText = cssTextForStyles(newStyles);
  renderCSSText(cssText);
  return compiledStyles;
}

// Replaces top level keys with css className text '.keyClassName'
// Replaces $modes with LESS style parent selector '&.modeClassName'
function setClassNamesForStyleDeclaration<T>(
  styles: StyleDeclaration,
): {compiledStyles: T, styles: StyleDeclaration} {
  let newStyles: StyleDeclaration = {};
  const compiledStyles: any = {};
  const classNames: {[k: string]: string} = {};

  for (const key in styles) {
    const classNamesForModes: {[k: string]: string} = {};
    const value = styles[key];
    const name = generateClassName([key]);
    const newKey = `.${name}`;

    newStyles[newKey] = setClassNamesForStyleRule([key], value, classNamesForModes);

    compiledStyles[key] = getCompiledStyle(name, classNamesForModes);

    classNames[key] = newKey;
  }
  newStyles = substitutePlaceholders(newStyles, classNames);
  return { styles: newStyles, compiledStyles };
}

function setClassNamesForStyleRule(
  keys: string[],
  style: StyleRule,
  classNamesForModes: {[k: string]: string},
) {
  const newStyle: StyleRule = {};
  for (let key in style) {
    const value = style[key];
    let newKeys = keys;
    if (isPropertyMode(key)) {
      const mode = key.slice(1);
      newKeys = keys.concat(mode);
      let modeClassName = classNamesForModes[mode];
      if (!modeClassName) {
        modeClassName = classNamesForModes[mode] = generateClassName(newKeys);
      }
      key = `&.${modeClassName}`;
    }

    if (key.indexOf('&') !== -1 && keys.length && isPropertyPseudo(keys[keys.length - 1])) {
      throw new Error(`Cannot have a parent selector as child of pseudo class/element: ${newKeys.join('|')}`);
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      newStyle[key] = setClassNamesForStyleRule(newKeys, value as StyleRule, classNamesForModes);
    } else {
      newStyle[key] = value;
    }
  }

  return newStyle;
}

function isPropertyMode(property: string) {
  return property.charAt(0) === '$';
}

function getCompiledStyle(className: string, classNamesForModes: {[key: string]: string}) {
  if (!Object.keys(classNamesForModes).length) {
    return className;
  } else {
    return function styleReducer(modes: ActiveModes) {
      const names = [className];
      for (const mode in modes) {
        if (modes[mode]) {
          names.push(classNamesForModes[mode]);
        }
      }
      return names.join(' ');
    };
  }
}

function substitutePlaceholders(
  styles: StyleDeclaration,
  classNames: {[k: string]: string },
): StyleDeclaration {
  for (const key in styles) {
    const value = styles[key];
    _substitutePlaceholders(value, classNames);
  }
  return styles;
}

function _substitutePlaceholders(
  styles: StyleRule,
  classNames: {[k: string]: string },
): StyleRule {
  for (const key in styles) {
    const value = styles[key];
    const newKey = key.replace(PLACEHOLDER_REGEX, (_substr: string, p1: string) => classNames[p1]);

    if (newKey !== key) {
      styles[newKey] = value;
      delete styles[key];
    }
    if (typeof value === 'object' && !Array.isArray(value)) {
      _substitutePlaceholders(value, classNames);
    }
  }
  return styles;
}
