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
// other plugins?
// keyframes
// addCSS
// more complex classNames

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
    $ghost: {
      backgroundColor: 'white',
      '@media screen and (max-width: 800px)': {
        width: '100px',
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

  render(): JSX.Element {
    const styles = StyleSheet.compute(STYLES, MODES, this.props, this.state);

    return (
      <div
        className={classnames(styles.root, this.props.className)}
        onMouseEnter={this._onMouseEnter}
        onMouseLeave={this._onMouseLeave}
      >
        Button
      </div>
    );
  }

  _onMouseEnter = () => {
    this.setState({hovered: true});
  }

  _onMouseLeave = () => {
    this.setState({hovered: false});
  }
}
