import * as _ from 'lodash';

import renderStyle from './libs/renderStyle';
import generateClassName from './libs/generateClassName';
import {
  CompiledStyleSheet,
  ClassNameResolver,
  Style,
  Styles,
} from './types';

export default function create<StyleSet extends Styles>(
  styles: StyleSet,
): CompiledStyleSheet<keyof StyleSet> {
  return _.mapValues(styles, style => renderStyleToReducer(style)) as any;
}

function renderStyleToReducer(style: Style) {
  const classNames = [generateClassName()];
  const classNamesForModes = {};
  renderStyle(style, classNames, classNamesForModes, '', []);
  return getCompiledStyle(classNames, classNamesForModes);
}

function getCompiledStyle(classNames: string[], classNamesForModes: {[key: string]: string}) {
  if (!Object.keys(classNamesForModes).length) {
    return classNames.join(' ');
  } else {
    return function styleReducer(modes: ClassNameResolver) {
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
