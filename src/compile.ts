import generateClassName from './libs/generateClassName';
import cssTextForStyles, { isPseudoSelector } from './libs/cssTextForStyles';
import renderCSSText from './libs/renderCSSText';
import {
  ActiveModes,
  CompiledStyleSheet,
  StyleDeclaration,
  StyleRule,
} from './types';
import { config as defaultConfig, Configuration } from './configure';

const PLACEHOLDER_REGEX = /\{([^\}]+)\}/g;

export function _compile(render: (cssTexts: string[], config: Configuration) => void) {
  return function compile<TKeys extends string>(
    styles: StyleDeclaration<TKeys>,
    configOverride: Partial<Configuration> = defaultConfig,
  ): CompiledStyleSheet<TKeys> {
    const config = { ...defaultConfig, ...configOverride } as Configuration;
    const {
      styles: newStyles,
      compiledStyles,
    } = setClassNamesForStyleDeclaration(styles, config);
    const cssText = cssTextForStyles(newStyles);
    render(cssText, config);
    return compiledStyles;
  };
}
export default _compile(renderCSSText);

// Replaces top level keys with css className text '.keyClassName'
// Replaces $modes with LESS style parent selector '&.modeClassName'
function setClassNamesForStyleDeclaration<TKeys extends string>(
  styles: StyleDeclaration<TKeys>,
  config: Configuration,
): {compiledStyles: CompiledStyleSheet<TKeys>, styles: StyleDeclaration<string>} {
  let newStyles: StyleDeclaration<string> = {};
  const compiledStyles: any = {};
  const classNames: {[k: string]: string} = {};

  for (const key in styles) {
    const classNamesForModes: {[k: string]: string} = {};
    const value = styles[key];
    const name = generateClassName([key], config);
    const newKey = `.${name}`;

    newStyles[newKey] = setClassNamesForStyleRule([key], value, classNamesForModes, config);

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
  config: Configuration,
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
        modeClassName = classNamesForModes[mode] = generateClassName(newKeys, config);
      }
      key = `&.${modeClassName}`;
    }

    if (key.indexOf('&') !== -1 && keys.length && isPseudoSelector(keys[keys.length - 1])) {
      throw new Error(`Cannot have a parent selector as child of pseudo class/element: ${newKeys.join('|')}`);
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      newStyle[key] = setClassNamesForStyleRule(newKeys, value as StyleRule, classNamesForModes, config);
    } else {
      newStyle[key] = value;
    }
  }

  return newStyle;
}

function isPropertyMode(property: string) {
  return property.charAt(0) === '$';
}

function getCompiledClassName(className: string, classNamesForModes?: {[key: string]: string}) {
  if (!classNamesForModes || !Object.keys(classNamesForModes).length) {
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
