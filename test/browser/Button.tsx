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

// unitless px
// media queries in order
// prefixing
// keyframes
// TODO
// addCSS
// hot module reloading
// friendly classNames
// testing
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
    backgroundColor: '#DDD',
  },
});

const STYLES = StyleSheet.create({
  root: {
    display: 'flex',
    backgroundColor: '#BBB',
    padding: 8,
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
  large: (props: Props) => !!props.large,
  hovered: (_props: Props, state: State) => state.hovered,
  ghost: (props: Props) => !!props.ghost,
};

export default class Button extends React.Component<Props, State> {
  state = {
    hovered: false,
  };

  styles = StyleSheet.compute(STYLES, MODES, this.props, this.state);

  componentWillUpdate(nextProps: Props, nextState: State) {
    this.styles = StyleSheet.compute(STYLES, MODES, nextProps, nextState);
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
