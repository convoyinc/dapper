import generateClassName from './libs/generateClassName';
import cssTextForStyles, { isPseudoSelector } from './libs/cssTextForStyles';
import renderCSSText from './libs/renderCSSText';
import {
  ActiveModes,
  CompiledStyleSheet,
  StyleDeclaration,
  StyleRule,
} from './types';

const PLACEHOLDER_REGEX = /\{([^\}]+)\}/g;

export default function compile<TKeys extends string>(
  styles: StyleDeclaration<TKeys>,
): CompiledStyleSheet<TKeys> {
  const {
    styles: newStyles,
    compiledStyles,
  } = setClassNamesForStyleDeclaration(styles);
  const cssText = cssTextForStyles(newStyles);
  renderCSSText(cssText);
  return compiledStyles;
}

// Replaces top level keys with css className text '.keyClassName'
// Replaces $modes with LESS style parent selector '&.modeClassName'
function setClassNamesForStyleDeclaration<TKeys extends string>(
  styles: StyleDeclaration<TKeys>,
): {compiledStyles: CompiledStyleSheet<TKeys>, styles: StyleDeclaration<string>} {
  let newStyles: StyleDeclaration<string> = {};
  const compiledStyles: any = {};
  const classNames: {[k: string]: string} = {};

  for (const key in styles) {
    const classNamesForModes: {[k: string]: string} = {};
    const value = styles[key];
    const name = generateClassName([key]);
    const newKey = `.${name}`;

    newStyles[newKey] = setClassNamesForStyleRule([key], value, classNamesForModes);

    compiledStyles[key] = getCompiledClassName(name, classNamesForModes);

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

    if (key.indexOf('&') !== -1 && keys.length && isPseudoSelector(keys[keys.length - 1])) {
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

function getCompiledClassName(className: string, classNamesForModes: {[key: string]: string}) {
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
  styles: StyleDeclaration<string>,
  classNames: {[k: string]: string},
): StyleDeclaration<string> {
  for (const key in styles) {
    const value = styles[key];
    _substitutePlaceholders(value, classNames);
  }
  return styles;
}

function _substitutePlaceholders(
  styles: StyleRule,
  classNames: {[k: string]: string},
): StyleRule {
  for (const key in styles) {
    const value = styles[key];
    const newKey = key.replace(PLACEHOLDER_REGEX, (_substr: string, p1: string) => {
      const className = classNames[p1];
      if (!className) {
        throw new Error(`Cannot find StyleRule key ${p1} referenced in placeholder ${key}`);
      }
      return className;
    });

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
