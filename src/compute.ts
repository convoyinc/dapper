import * as _ from 'lodash';
import create, { CompiledStyle } from './create';

export type ModeResolver<P, S> = {[key: string]: (props: P, state: S) => boolean};

export type ComputedStyleSheet<Keys extends string> = {
  [Key in Keys]: ComputedStyle;
};

export type ComputedStyle = string;

export default {
  create,

  compute<Styles extends Object, Props, State>(
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
  },
};
