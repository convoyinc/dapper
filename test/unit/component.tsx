import * as React from 'react';
import * as classnames from 'classnames';

import dapper from '../../src/styles';

export interface Props {
  isCool: boolean;
}

export interface State {
  hovered: boolean;
}

// const fadeOut = dapper.keyframes({
//   '0%': {
//     opacity: 1,
//   },
//   '100%': {
//     opacity: 0,
//   },
// });

// dapper.addCSS({
//   '.box': {
//     '-webkit-scrollbar': 'none',
//   },
// });

const STYLES = {
  root: {
    background: 'red',
    ':hover': {
      $isCool: {
        // animation: `1s ${fadeOut}`,
      },
    },
    $isCool: {
      background: 'blue',
      '@media (min-width: 300px)': {
        background: 'red',
      },
      $blah: {
        background: 'black',
      },
    },
    $blah: {
      background: 'green',
      $isCool: {
        background: '#ff00ff',
      },
    },
  },
  blah: {
    border: '1px solid black',
  },
};

const MODES = {
  isCool: (props: Props) => props.isCool,
  hovered: (_props: Props, state: State) => state.hovered,
};

export default class Component extends React.Component<Props, State> {

  styles = dapper(STYLES, MODES, this);

  render(): JSX.Element {
    return (
      <div className={classnames(this.styles.root, this.styles.blah)} />
    );
  }
}
