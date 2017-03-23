import * as React from 'react';

import * as dapper from '../../src';

const STYLES = dapper.createSimple({
  root: {
    display: 'flex',
    backgroundColor: '#BBB',
    padding: 8,
  },
});

export default class Button extends React.Component<{}, {}> {
  render(): JSX.Element {
    return (
      <div className={STYLES.root} />
    );
  }

}
