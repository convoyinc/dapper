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

// TODO unitless px
// media queries in order
// hot module reloading
// other plugins? prefixing
// keyframes
// addCSS
// friendly classNames

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

const STYLES = StyleSheet.create({
  root: {
    display: 'inline-block',
    backgroundColor: '#BBB',
    padding: '8px',
    width: '200px',
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
