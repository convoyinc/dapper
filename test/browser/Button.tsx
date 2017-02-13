import * as React from 'react';
import * as classnames from 'classnames';

import StyleSheet from '../../src';

export interface Props {
  large?: boolean;
  ghost?: boolean;
  className?: string;
}

export interface State {
  hovered: boolean;
}

export type ModeState = { props: Props, state: State };

// TODO
// testing (create, keyframes, renderStatic)
// reverse lookup of styles from className

const fadeOut = StyleSheet.keyframes({
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

StyleSheet.renderStatic({
  'html, body': {
    backgroundColor: '#CCFFFF',
    '@media (max-width: 800px)': {
      backgroundColor: '#FFCCFF',
    },
  },
});

const STYLES = StyleSheet.create({
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
      borderRight: '1px solid #000',
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

  styles = StyleSheet.compute(STYLES, MODES, { props: this.props, state: this.state });

  componentWillUpdate(props: Props, state: State) {
    this.styles = StyleSheet.compute(STYLES, MODES, { props, state });
  }

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
