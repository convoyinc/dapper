import * as _ from 'lodash';
import {
  CompiledStyle,
  CompiledStyleSheet,
  ComputedStyleSheet,
  ModeDeclarations,
} from './types';

export default function compute<TKeys extends string, State>(
  compiledStyles: CompiledStyleSheet<TKeys>,
  modeDeclarations: ModeDeclarations<State>,
  state: State,
): ComputedStyleSheet<TKeys> {
  const modes = _.mapValues(modeDeclarations, resolver => resolver(state));

  return _.mapValues(compiledStyles, (style: CompiledStyle) => {
    if (typeof style === 'string') {
      return style;
    } else {
      return style(modes);
    }
  }) as any;
};
