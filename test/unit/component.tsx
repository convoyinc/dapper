import * as React from 'react';
import { shallow } from 'enzyme';

import configure from '../../src/configure';
import { resetUniqueId } from '../../src/libs/generateClassName';
import * as dapper from '../../src';

describe(`component`, () => {
  let renderCSSTextStub: sinon.SinonStub;

  before(() => {
    configure({ friendlyClassNames: true });
  });

  beforeEach(() => {
    renderCSSTextStub = sandbox.stub();
    resetUniqueId();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`div`, () => {
    // Same as: const Root = dapper.div('ButtonRoot', {
    const Root = dapper._component<React.HTMLAttributes<HTMLDivElement>>(renderCSSTextStub)('div', 'ButtonRoot',
      {
        padding: 5,
        backgroundColor: 'blue',
        '@media (min-width: 500)': {
          padding: 2,
        },
      },
      {
        small: {
          fontSize: 12,
        },
        color: {
          color: (c: string) => c,
          backgroundColor: (c: string) => c,
        },
      },
    );

    expect(renderCSSTextStub).to.have.been.calledWith([
      `.dapper-ButtonRoot-a{padding:5px;background-color:blue}`,
      `@media (min-width: 500){.dapper-ButtonRoot-a{padding:2px}}`,
    ]);
    expect(renderCSSTextStub).to.have.been.calledWith([
      `.dapper-ButtonRoot-small-b{font-size:12px}`,
    ]);

    const wrapper = shallow(<Root small color='#455' />);
    expect(wrapper.html()).to.equal(`<div ` +
      `style="color:#455;background-color:#455;" ` +
      `class="dapper-ButtonRoot-a dapper-ButtonRoot-small-b dapper-ButtonRoot-color-c">` +
      `</div>`);
  });

  it(`input`, () => {

    // Same as: const Root = dapper.input('Input', {
    const Input = dapper._component<React.HTMLAttributes<HTMLInputElement>>(renderCSSTextStub)('input', 'Input',
      {
        padding: 5,
        backgroundColor: 'blue',
        '@media (min-width: 500)': {
          padding: 2,
        },
      },
      {
        small: {
          fontSize: 12,
        },
        color: {
          color: (c: string) => c,
          backgroundColor: (c: string) => c,
        },
      },
    );

    expect(renderCSSTextStub).to.have.been.calledWith([
      `.dapper-Input-a{padding:5px;background-color:blue}`,
      `@media (min-width: 500){.dapper-Input-a{padding:2px}}`,
    ]);
    expect(renderCSSTextStub).to.have.been.calledWith([
      `.dapper-Input-small-b{font-size:12px}`,
    ]);

    function onBlur() {}

    const wrapper = shallow(<Input onBlur={onBlur} small color='#455' />);
    expect(wrapper.html()).to.equal(`<input ` +
      `style="color:#455;background-color:#455;" ` +
      `class="dapper-Input-a dapper-Input-small-b dapper-Input-color-c">` +
      `</input>`);
  });

  it(`position`, () => {
    const Root = dapper.div('Root',
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

    const Positioned = dapper.position(Root, 'Positioned',
      {
        margin: 5,
      },
    );

    return <Positioned small color='#445' h />;
  });
});
