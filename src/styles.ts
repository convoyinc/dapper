import * as _ from 'lodash';
import * as React from 'react';

export type CompiledStyleSheet<Keys extends string> = {
  [Key in Keys]: CompiledStyle;
};

export type CompiledStyle = string;

export type ModeResolver<P, S> = {[key: string]: (props: P, state: S) => boolean};

export default function dapper<Styles extends Object, Props, State>(
  styles: Styles,
  modeResolver: ModeResolver<Props, State>,
  instance: React.Component<Props, State>,
): CompiledStyleSheet<keyof Styles> {

  const x = {};
  _.forEach(styles, (_style, key: string) => {
    Object.defineProperty(x, key, {
      get() {
        modeResolver[key](instance.props, instance.state);
        return 'a';
      },
    });
  });

  return x as CompiledStyleSheet<keyof Styles>;
}
