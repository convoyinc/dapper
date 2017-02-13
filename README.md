# Dapper

## Getting Started

`npm install @convoy/dapper`

### Contributing

1. Switch to the right node: `nvm install`
2. Install the dependencies: `npm install`
3. Watch for changes: `npm start`

## Basic usage

```
import StyleSheet from '@convoy/dapper';

const STYLES = StyleSheet.create({
  root: {
    display: 'flex',
    backgroundColor: '#BBB',
    padding: 8,
    width: '200px',
  },
});

export default class Button extends React.Component<Props, State> {
  render(): JSX.Element {
    return (
      <div className={classnames(STYLES.root, this.props.className)} />
    );
  }
}
```

## Prop or state based styling

```
import StyleSheet from '@convoy/dapper';

export interface Props {
  large?: boolean;
  ghost?: boolean;
  className?: string;
}

export interface State {
  hovered: boolean;
}

export type ModeState = { props: Props, state: State };

const STYLES = StyleSheet.create({
  root: {
    display: 'flex',
    backgroundColor: '#BBB',
    padding: 8,
    margin: {
      $large: 10,
      $ghost: 5,
    },
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
```

## keyframes

```
import StyleSheet from '@convoy/dapper';

const fadeOut = StyleSheet.keyframes({
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

const STYLES = StyleSheet.create({
  root: {
    animation: `5s ${fadeOut} linear`,
  },
});
```

## renderStatic

```
StyleSheet.renderStatic({
  'html, body': {
    backgroundColor: '#CCFFFF',
    '@media (max-width: 800px)': {
      backgroundColor: '#FFCCFF',
    },
  },
});
```

## configure

```
StyleSheet.configure({
  node: document.querySelector('#stylesheet'),
  classNamePrefix: 'app-',
  keyframePrefixes: ['-webkit-', '-moz-'],
  friendlyClassNames: false,
})
