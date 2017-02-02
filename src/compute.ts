import * as _ from 'lodash';
import {
  CompiledStyle,
  ModeResolver,
  ComputedStyleSheet,
} from './types';

export default function compute<Styles extends Object, Props, State>(
  compiledStyles: Styles,
  modeResolver: ModeResolver<Props, State>,
  props: Props,
  state: State,
): ComputedStyleSheet<keyof Styles> {
  const modes = _.mapValues(modeResolver, resolver => resolver(props, state));

  return _.mapValues(compiledStyles, (style: CompiledStyle) => {
    if (typeof style === 'string') {
      return style;
    } else {
      return style(modes);
    }
  }) as any;
};
