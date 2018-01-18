import * as React from 'react';
import configure from '../../src/configure';
import { resetUniqueId } from '../../src/libs/generateClassName';
import * as dapper from '../../src';

describe(`component`, () => {
  before(() => {
    configure({ friendlyClassNames: true });
  });

  beforeEach(() => {
    resetUniqueId();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`blah`, () => {
    const Button = dapper.div('Button',
      {
        padding: 5,
        backgroundColor: 'blue',
        '@media (min-width: 500)': {
          padding: 2,
          backgroundColor: 'red',
        },
      },
      {
        small: {
          fontSize: 12,
          padding: 2,
          flexAlign: 'self',
        },
        color: {
          color: (c: string) => c,
          backgroundColor: (c: string) => c,
        },
      },
    );

    const SmallButton = dapper.theme(Button, {
      small: true,
      color: '#455',
    });

    return <SmallButton small color='#454' />;
  });
});
