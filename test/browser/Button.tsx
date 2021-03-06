import * as React from 'react';
import * as classnames from 'classnames';

import * as dapper from '../../src';

export interface Props {
  large?: boolean;
  ghost?: boolean;
  className?: string;
}

export interface State {
  hovered: boolean;
}

export type ModeState = { props: Props, state: State };

const fadeOut = dapper.keyframes({
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

dapper.renderStatic({
  'html, body': {
    backgroundColor: '#CCFFFF',
    '@media (max-width: 800px)': {
      backgroundColor: '#FFCCFF',
    },
  },
});

const STYLES = dapper.compile({
  root: {
    display: 'flex',
    backgroundColor: '#BBB',
    padding: 8,
    margin: {
      $large: 10,
      $ghost: 5,
    },
    width: '200px',
    animation: `5s ${fadeOut} linear`,
    ':hover': {
      backgroundColor: '#555',
      $ghost: {
        backgroundColor: '#000045',
      },
    },
    '@media (max-width: 800px)': {
      width: '100px',
    },
    $ghost: {
      backgroundColor: 'white',
      '@media (max-width: 800px)': {
        backgroundColor: '#DDD',
      },
      $large: {
        border: '1px solid #000',
      },
    },
    $large: {
      padding: '16px',
      fontSize: '20px',
    },
    $hovered: {
      color: 'white',
    },
  },
  text: {
    display: 'inline-block',
  },
});

const MODES = {
  large: ({ props }: ModeState) => !!props.large,
  hovered: ({ state }: ModeState) => state.hovered,
  ghost: ({ props }: ModeState) => !!props.ghost,
};

export default class Button extends React.Component<Props, State> {
  state = {
    hovered: false,
  };

  styles = dapper.reactTo(this, STYLES, MODES);

  render(): JSX.Element {
    return (
      <div
        className={classnames(this.styles.root, this.props.className)}
        onMouseEnter={this._onMouseEnter}
        onMouseLeave={this._onMouseLeave}
      >
        {this._renderText()}
      </div>
    );
  }

  _renderText() {
    return (
      <span className={this.styles.text}>
        Button
      </span>
    );
  }

  _onMouseEnter = () => {
    this.setState({hovered: true});
  }

  _onMouseLeave = () => {
    this.setState({hovered: false});
  }
}
