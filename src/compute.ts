import * as _ from 'lodash';
import {
  CompiledStyle,
  CompiledStyleSheet,
  ComputedStyleSheet,
  ModeDeclarations,
  StyleDeclaration,
} from './types';
import compile from './compile';

export default function compute<TKeys extends string, State>(
  compiledStyles: CompiledStyleSheet<TKeys>|StyleDeclaration<TKeys>,
  modeDeclarations?: ModeDeclarations<State>,
  state?: State,
): ComputedStyleSheet<TKeys> {
  if (!modeDeclarations && !state) {
    compiledStyles = compile(compiledStyles as StyleDeclaration<TKeys>);
  } else if (!modeDeclarations || !state) {
    throw new Error('Must provide modeDeclarations and state or neither of them');
  }

  const modes = _.mapValues(modeDeclarations as ModeDeclarations<State>, resolver => resolver(state as State));

  return _.mapValues(compiledStyles, (style: CompiledStyle) => {
    if (typeof style === 'string') {
      return style;
    } else {
      return style(modes);
    }
  }) as any;
};
