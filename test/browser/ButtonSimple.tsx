import * as React from 'react';

import StyleSheet from '../../src';

const STYLES = StyleSheet.createSimple({
  root: {
    display: 'inline-flex',
    backgroundColor: '#BBB',
    padding: 8,
  },
});

export default class Button extends React.Component<{}, {}> {
  render(): JSX.Element {
    return (
      <div className={STYLES.root}>BUTTEN</div>
    );
  }

}
