<img width="35%" height="35%" src="https://cloud.githubusercontent.com/assets/4240309/25258098/c3c37a1c-25f1-11e7-802f-ca47f7991000.png" />

[![CircleCI](https://img.shields.io/circleci/project/github/convoyinc/dapper.svg)](https://circleci.com/gh/convoyinc/dapper)
[![Codecov](https://img.shields.io/codecov/c/github/convoyinc/dapper.svg)](https://codecov.io/gh/convoyinc/dapper)
[![npm (scoped)](https://img.shields.io/npm/v/@convoy/dapper.svg)](https://www.npmjs.com/package/@convoy/dapper)

Dapper is a Javascript/TypeScript styling library ([CSS-in-JS](https://speakerdeck.com/vjeux/react-css-in-js) or CSS-in-TS). It features:
 - Dynamic styles using modes, (i.e. in React, it styles based on props and state)
 - TypeScript autocomplete and build-time checks

 - Utilizes some of the best features of LESS/SASS CSS such as
    - nested styles
    - parent selectors
 - CSS features such as
    - media queries
    - keyframes
    - pseudo classes and psuedo elements
    - auto-prefixing (for cross-browser compatibility)
    - unitless values (use 5 instead of '5px')
    - paddingHorizontal, paddingVertical, and same for margin
 - Additional helpers to inject arbitrary CSS (great when styling 3rd party code)


## Getting Started

`npm install @convoy/dapper`

## TypeScript/Javascript
Most examples are shown in TypeScript, but dapper works great with Javascript. TypeScript provides autocompletion of your styles and at build time checks that those styles exist.

## React usage

### Static Styles

```tsx
import * as dapper from '@convoy/dapper';

const STYLES = dapper.compile({
  root: {
    padding: 5,
  },
});

export default class Button extends React.Component<Props, State> {
  styles = dapper.reactTo(this, STYLES);

  render() {
    return (
      <div className={this.styles.root} />
    );
  }
}
```
Dapper generates a `<style>` element dynamically with autogenerated classes for each style rule.

The above generates the following CSS:
```
.dapper-root-a {
  padding: 5px;
}
```

### Dynamic Styles
Dapper enables dynamic styles using "modes", a series of functions that defines all the different "modes" or ways your component can look. This creates a nice separation of concerns removing a lot of if/else branching logic from your render function.

```tsx
import * as dapper from '@convoy/dapper';

interface Props {
  highlight: boolean;
}

interface State {
  value: string;
}

const STYLES = dapper.compile({
  root: {
    backgroundColor: '#EEE',
    $highlight: {
      backgroundColor: '#FFF',
    },
  },
  input: {
    $tooLong: {
      color: 'red',
    },
  },
});

const MODES = {
  highlight: ({ props }: { props: Props }) => props.highlight,
  tooLong: ({ state }: { state: State }) => state.value.length > 8,
};

export default class Button extends React.Component<Props, State> {
  state = { value: '' };

  styles = dapper.reactTo(this, STYLES, MODES);

  render() {
    return (
      <div className={this.styles.root}>
        <input
          value={this.state.value}
          onChange={this._onChange}
        />
      </div>
    );
  }

  _onChange = ev => {
    this.setState({ value: ev.target.value });
  }
}
```

The above generates the following CSS:
```
.dapper-root-a {
  background-color: #EEE;
}

.dapper-root-highlight-b {
  background-color: #FFF;
}

.dapper-input-tooLong-c {
  color: red;
},
```
and applies clases like `.dapper-input-highlight-b` dynamically to the div if `props.highlight` is `true`, and similarly adds `.dapper-input-tooLong-c` to the input when `state.value.length > 8`.

## Pseudo-selectors and psuedo-elements
CSS pseudo-selectors, such as `:hover` and `:active` and pseudo-elements such as `::before` and `::after` are supported as you might expect.

```tsx
import * as dapper from '@convoy/dapper';

const STYLES = dapper.compile({
  root: {
    ':hover': {
      backgroundColor: '#EEE',
    },
    '::after': {
      content: '"+"',
    },
  },
});

export default class Button extends React.Component<Props, State> {
  styles = dapper.reactTo(this, STYLES);

  render() {
    return (
      <div className={this.styles.root} />
    );
  }
}
```
The above generates the following CSS:
```
.dapper-root-a:hover {
  background-color: #EEE;
}

.dapper-root-a::after {
  content: "+";
}
```

## Placeholders
Placeholders allow you to reference other styles names inside of a style rule. This can be helpful for cascading styles. Such as in this example, when `child` should look different when inside of `parentA` vs `parentB`.

```tsx
import * as dapper from '@convoy/dapper';

const STYLES = dapper.compile({
  parentA: {
    '{child}': {
      backgroundColor: 'red',
    },
  },
  parentB: {
    '{child}': {
      backgroundColor: 'blue',
    },
  },
  child: {
    padding: 5,
  }
});

export default class Button extends React.Component<Props, State> {
  styles = dapper.reactTo(this, STYLES);

  render() {
    const { styles } = this;
    return (
      <div>
        <div className={styles.parentA}>
          <div className={styles.child} />
        </div>
        <div className={styles.parentB}>
          <div className={styles.child} />
        </div>
      </div>
    );
  }
}
```
The above generates the following CSS:
```
.dapper-parentA-a .dapper-child-c {
  background-color: red;
}

.dapper-parentB-b .dapper-child-c {
  background-color: blue;
}

.dapper-child-c {
  padding: 5px;
}
```

## Parent selectors
 Parent selectors allow you to swap in the current selector into a new location in a selector. This is helpful when you want to prefix the generated classname for things like global classnames.

 ```tsx
import * as dapper from '@convoy/dapper';

const STYLES = dapper.compile({
  root: {
    'html.wf-loading &': {
      opacity: 0,
    },
  },
});

export default class Button extends React.Component<Props, State> {
  styles = dapper.reactTo(this, STYLES);

  render() {
    return (
      <div className={this.styles.root}>
        Hello World
      </div>
    );
  }
}
```

The above generates the following CSS:
```
html.wf-loading .dapper-root-a {
  opacity: 0,
}
```

## Hover on parent element
Placeholders and parent selectors makes it easy to support things like styling child elements based on pseudo class selectors of parents, like hover. This helps avoid creating onMouseEnter, onMouseLeave handlers.

```tsx
import * as dapper from '@convoy/dapper';

const STYLES = dapper.compile({
  root: {
    padding: 5,
  },
  child: {
    '{root}:hover &': {
      backgroundColor: '#EEE',
    },
  },
});

export default class Button extends React.Component<Props, State> {
  styles = dapper.reactTo(this, STYLES);

  render() {
    return (
      <div className={this.styles.root}>
        <div className={this.styles.child} />
      </div>
    );
  }
}
```
The above generates the following CSS:
```
.dapper-root-a {
  padding: 5px;
}

.dapper-root-a:hover .dapper-child-b {
  background-color: #EEE;
}
```

## Media queries
Dapper supports media queries, including nested media queries.
```tsx
import * as dapper from '@convoy/dapper';

const STYLES = dapper.compile({
  root: {
    width: 200,
    '@media (max-width: 800px)': {
      '@media (orientation: landscape)': {
        width: 100,
      },
      '@media (orientation: portrait)': {
        width: 60,
      },
    },
  },
});

export default class Button extends React.Component<Props, State> {
  styles = dapper.reactTo(this, STYLES);

  render() {
    return (
      <div className={this.styles.root} />
    );
  }
}
```
The above generates the following CSS:
```
.dapper-root-a {
  width: 200px;
}
@media (max-width: 800px) and (orientation: landscape) {
  .dapper-root-a {
    width: 100px;
  }
}
@media (max-width: 800px) and (orientation: portrait) {
  .dapper-root-a {
    width: 60px;
  }
}
```

## Nesting media queries/modes/pseudo
Media queries, modes and pseudo class/element selectors can be nested within CSS properties to make things more readable.

```js
const STYLES = dapper.compile({
  root: {
    padding: {
      $small: 2,
      $medium: 4,
      $large: 8,
    },
    backgroundColor: {
      ':hover': '#EEE',
      ':focus': '#DDD',
    },
    width: {
      '@media (max-width: 500px)': 100,
      '@media (min-width: 500px)': 400,
    },
  },
});
```
The above generates the following CSS:
```
.dapper-root-a.dapper-root-small-b {
  padding: 2px;
}
.dapper-root-a.dapper-root-medium-b {
  padding: 4px;
}
.dapper-root-a.dapper-root-large-b {
  padding: 8px;
}
.dapper-root-a:hover {
  background-color: '#EEE';
}
.dapper-root-a:focus {
  background-color: '#DDD';
}
@media (max-width: 500px) {
  .dapper-root-a {
    width: 100px;
  }
}
@media (min-width: 500px) {
  .dapper-root-a {
    width: 400px;
  }
}

```

## keyframes (CSS Animations)
Dappers keyframes function generates CSS animation names which can then be referenced in styles.

```tsx
import * as dapper from '@convoy/dapper';

const fadeOut = dapper.keyframes({
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

const STYLES = dapper.compile({
  root: {
    animation: `5s ${fadeOut} linear`,
  },
});
```
The above generates the following CSS:
```
@keyframes dapper-anim-a {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.dapper-root-a {
  animation: 5s dapper-anim-a linear;
}
```

## paddingHorizontal, paddingVertical, marginHorizontal and marginVertical
Dapper supports easy ways to add the same padding and margin on to the top and bottom or the left and right using paddingHorizontal and paddingVertical or the margin equivalents.

```tsx
import * as dapper from '@convoy/dapper';

const STYLES = dapper.compile({
  root: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
});
```
The above generates the following CSS:
```
.dapper-root-a {
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 8px;
  padding-bottom: 8px;
}
```

## renderStatic (arbitrary CSS)
Sometimes you need to add arbitrary CSS to a document, such as when you are working with a third party library that controls its portion of the DOM tree.

```js
dapper.renderStatic({
  'html, body': {
    backgroundColor: '#CCFFFF',
    '@media (max-width: 800px)': {
      backgroundColor: '#FFCCFF',
    },
  },
  '.pac-container': {
    backgroundColor: '#EEE',
  },
});
```
The above generates the following CSS:
```
html, body {
  background-color: #CCFFFF;
}
@media (max-width: 800px) {
  html, body {
    background-color: #FFCCFF;
  }
}
.pac-container {
  background-color: #EEE;
}
```

## configure (Configuration settings)
Dapper works out of the box without any configuration needed. The default configuration can overridden globally however, by providing one or many of the following parameters:

`node` (optional): The style element to render styles into. Default is a newly created style element appended to document.head.

`classNamePrefix` (optional): The prefix to add all generated classnames. Default if `process.env.NODE_ENV === 'production'` is `d-`, otherwise the default is `dapper-`.

`friendlyClassNames` (optional): A flag dictating that all generated classnames use the full key path of the style, making it easy to identify in browser dev tools where in code is responsible for a style. Default if `process.env.NODE_ENV === 'production'` is `false`, otherwise the default is `true`.

`useInsertRule` (optional): A flag dictating that when rendering to the style element whether to use CSSStyleSheet.insertRule or innerHTML. Using insertRule is faster because it means the browser has less to repeatedly parse, but is more difficult to inspect using browser dev tools. Default if `process.env.NODE_ENV === 'production'` is `true`, otherwise the default is `false`.

`omitUniqueSuffices` (optional): A flag allowing unique suffix generation to be turned off. Useful for snapshot testing, e.g.:

![image](./omitUniqueSuffices.png)

```js
dapper.configure({
  node: document.querySelector('#stylesheet'),
  classNamePrefix: 'app-',
  friendlyClassNames: false,
  useInsertRule: true,
})
```

Configuration can also be used per call to `compile`, `keyframes` and `renderStatic` to override the global configuration. This can be useful when you want to render to a different element which allows you to separately unload those styles.

```js
dapper.compile({
  root: {
    padding: 5,
  },
}, {
  node: document.querySelector('#styles'),
});
```

## compute
Dapper exposes a `compute` function which takes the output of `compile`, any functions that define the modes and an object that defines the current state to compute the modes with and returns the classnames of the various styles. This function is useful even outside of React contexts or when rendering items in a list which have their own modes that aren't based directly on props or state. In React, we primarily use `reactTo`, which is a simple wrapper around `compute` that uses the component as the state to compute modes from.

```tsx
import * as dapper from '@convoy/dapper';

const STYLES = dapper.compile({
  root: {
    width: 200,
  },
});

const ITEM_STYLES = dapper.compile({
  root: {
    backgroundColor: '#CCC',
  },
});

const ITEM_MODES = {
  highlight: (item: Item) => item.highlight,
};

export default class Button extends React.Component<Props, State> {
  styles = dapper.reactTo(this, STYLES);

  render() {
    return (
      <div className={this.styles.root}>
        {this.props.items.map(this._renderItem)}
      </div>
    );
  }

  _renderItem(item) {
    const styles = dapper.compute(ITEM_STYLES, ITEM_MODES, item);
    return (
      <div className={styles.root}>
        {item.label}
      </div>
    );
  }
}
```

## Contributing

1. Switch to the right node: `nvm install`
2. Install the dependencies: `npm install`
3. Watch for changes: `npm start`
