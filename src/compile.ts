import generateClassName from './libs/generateClassName';
import cssTextForStyles from './libs/cssTextForStyles';
import renderCSSText from './libs/renderCSSText';
import {
  ActiveModes,
  CompiledStyleSheet,
  StyleDeclaration,
  StyleRule,
} from './types';
import { config as defaultConfig, Configuration } from './configure';

export default function compile<StyleSet extends StyleDeclaration>(
  styles: StyleSet,
  config: Configuration = defaultConfig,
): CompiledStyleSheet<keyof StyleSet> {
  config = { ...defaultConfig, ...config };
  const {styles: newStyles, classNames} = setClassNamesForStyles<CompiledStyleSheet<keyof StyleSet>>(styles, config);
  const cssText = cssTextForStyles(newStyles);
  renderCSSText(cssText, config);
  return classNames;
}

// Replaces top level keys with css className text '.keyClassName'
// and replaces $modes with LESS style parent selector '&.modeClassName'
function setClassNamesForStyles<T>(
  styles: StyleDeclaration,
  config: Configuration,
): {classNames: T, styles: StyleDeclaration} {
  const newStyles: StyleDeclaration = {};
  const classNames: any = {};

  for (const key in styles) {
    const classNamesForModes: {[k: string]: string} = {};
    const value = styles[key];
    const name = generateClassName([key], config);
    const newKey = `.${name}`;

    newStyles[newKey] = setClassNamesForStyle([key], value, classNamesForModes, config);

    classNames[key] = getCompiledStyle(name, classNamesForModes);
  }

  return { styles: newStyles, classNames };
}

function setClassNamesForStyle(
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

    if (typeof value === 'object' && !Array.isArray(value)) {
      newStyle[key] = setClassNamesForStyle(newKeys, value as StyleRule, classNamesForModes, config);
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
