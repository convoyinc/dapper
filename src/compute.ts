import * as _ from 'lodash';
import {
  CompiledStyle,
  ModeResolver,
  ComputedStyleSheet,
} from './types';

export default function compute<Styles extends Object, State>(
  compiledStyles: Styles,
  modeResolver: ModeResolver<State>,
  state: State,
): ComputedStyleSheet<keyof Styles> {
  const modes = _.mapValues(modeResolver, resolver => resolver(state));

  return _.mapValues(compiledStyles, (style: CompiledStyle) => {
    if (typeof style === 'string') {
      return style;
    } else {
      return style(modes);
    }
  }) as any;
};
