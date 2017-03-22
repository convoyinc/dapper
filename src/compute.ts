import * as _ from 'lodash';
import {
  CompiledStyle,
  ModeDeclarations,
  ComputedStyleSheet,
} from './types';

export default function compute<Styles extends Object, State>(
  compiledStyles: Styles,
  modeDeclarations: ModeDeclarations<State>,
  state: State,
): ComputedStyleSheet<keyof Styles> {
  const modes = _.mapValues(modeDeclarations, resolver => resolver(state));

  return _.mapValues(compiledStyles, (style: CompiledStyle) => {
    if (typeof style === 'string') {
      return style;
    } else {
      return style(modes);
    }
  }) as any;
};
