import * as React from 'react';
import { shallow } from 'enzyme';

import configure from '../../src/configure';
import { resetUniqueId } from '../../src/libs/generateClassName';
import * as dapper from '../../src';
import renderCSSText from '../../src/libs/renderCSSText';

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
    // Same as: dapper.div('ButtonRoot' ...) but needed to
    // inject renderCSSText
    // const component = dapper._component(renderCSSText);
    // const Root = component<
    //   React.HTMLAttributes<HTMLDivElement>,
    //   'small'|'color'
    //  >('div', 'ButtonRoot',
    const Root = dapper.div('ButtonRoot', {
      padding: 5,
      backgroundColor: {
        $blue: 'blue',
        $red: 'red',
      },
      '@media (min-width: 500)': {
        padding: 2,
      },
      $small: {
        $bright: {
          outline: 'yellow',
        },
      },
      $color: {
        color: (c: string) => c,
        backgroundColor: (c: string) => c,
      },
    });

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

    // Same as: dapper.input('Input' ...) but needed to
    // inject renderCSSText
    const component = dapper._component(renderCSSText);
    const Input = component<
      React.HTMLAttributes<HTMLInputElement>,
      'small'|'color'
     >('input', 'Input',
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

    const wrapper = shallow(<Input onBlur={onBlur} color small />);
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
          color: (props:any) => props.color,
          backgroundColor: (c: string) => c,
        },
      },
    );

    const Positioned = dapper.position(Root, 'Positioned',
      {
        margin: 5,
      },
    );

    return <Positioned small color='#445' />;
  });
});

// TODO: function rules should get all props not just the one,
// TODO: can't nest modes, go back to $?
// TODO: can't put modes as children of css property (i.e. color: { $blue: ..., $red: ... })
// TODO: put media queries/pseudos as child of css property
// TODO: put _styles as static on class
// TODO: put className as static on class
// TODO: ensure parent selector still works
// TODO: ensure nested media queries still works
// TODO: put arbitrary classNames
