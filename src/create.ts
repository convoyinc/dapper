import generateClassName from './libs/generateClassName';
import cssTextForStyles from './libs/cssTextForStyles';
import renderCSSText from './libs/renderCSSText';
import {
  CompiledSimpleStyleSheet,
  CompiledStyleSheet,
  ClassNameResolver,
  Style,
  Styles,
} from './types';

export default function create<StyleSet extends Styles>(
  styles: StyleSet,
): CompiledStyleSheet<keyof StyleSet> {
  const {styles: newStyles, classNames} = setClassNamesForStyles<CompiledStyleSheet<keyof StyleSet>>(styles);
  const cssText = cssTextForStyles(newStyles);
  renderCSSText(cssText);
  return classNames;
}

export function createSimple<StyleSet extends Styles>(
  styles: StyleSet,
): CompiledSimpleStyleSheet<keyof StyleSet> {
  const {styles: newStyles, classNames} = setClassNamesForStyles<CompiledSimpleStyleSheet<keyof StyleSet>>(styles);
  const cssText = cssTextForStyles(newStyles);
  renderCSSText(cssText);
  return classNames;
}

// Replaces top level keys with css className text '.keyClassName'
// and replaces $modes with LESS style parent selector '&.modeClassName'
function setClassNamesForStyles<T>(
  styles: Styles,
): {classNames: T, styles: Styles} {
  const newStyles: Styles = {};
  const classNames: any = {};

  for (const key in styles) {
    const classNamesForModes: {[k: string]: string} = {};
    const value = styles[key];
    const name = generateClassName([key]);
    const newKey = `.${name}`;

    newStyles[newKey] = setClassNamesForStyle([key], value, classNamesForModes);

    classNames[key] = getCompiledStyle(name, classNamesForModes);
  }

  return { styles, classNames };
}

function setClassNamesForStyle(
  keys: string[],
  style: Style,
  classNamesForModes: {[k: string]: string},
) {
  const newStyle: Style = {};
  for (const key in style) {
    const value = style[key];
    let newKey = key;
    if (isPropertyMode(key)) {
      const mode = key.slice(1);
      keys = keys.concat(mode);
      let modeClassName = classNamesForModes[mode];
      if (!modeClassName) {
        modeClassName = classNamesForModes[mode] = generateClassName(keys);
      }
      newKey = `&.${modeClassName}`;
    }

    if (value instanceof Object && !Array.isArray(value)) {
      newStyle[newKey] = setClassNamesForStyle(keys, value as Style, classNamesForModes);
    } else {
      newStyle[newKey] = value;
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
    return function styleReducer(modes: ClassNameResolver) {
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
