import * as _ from 'lodash';

import renderStyle from './libs/renderStyle';
import generateClassName from './libs/generateClassName';
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
  return _.mapValues(styles, (style, key: string) => renderStyleToReducer(style, key, true)) as any;
}

function renderStyleToReducer(style: Style, key: string, allowModes: boolean) {
  const classNames = [generateClassName([key])];
  const classNamesForModes = {};
  const renderClassNames = classNames.map(cn => `.${cn}`);
  renderStyle([key], style, renderClassNames, classNamesForModes);
  return getCompiledStyle(classNames, classNamesForModes, allowModes);
}

function getCompiledStyle(classNames: string[], classNamesForModes: {[key: string]: string}, allowModes: boolean) {
  if (!Object.keys(classNamesForModes).length) {
    return classNames.join(' ');
  } else {
    if (!allowModes) {
      throw new Error('createSimple called with modes');
    }
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

export function createSimple<StyleSet extends Styles>(
  styles: StyleSet,
): CompiledSimpleStyleSheet<keyof StyleSet> {
  return _.mapValues(styles, (style, key: string) => renderStyleToReducer(style, key, false)) as any;
}
