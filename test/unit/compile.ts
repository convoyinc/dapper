import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';
import configure from '../../src/configure';
import { resetUniqueId } from '../../src/libs/generateClassName';

proxyquire.noCallThru();

const stub = { default: null as any };
const sandbox = sinon.sandbox.create();

const {default: compile } = proxyquire('../../src/compile', {
  './libs/renderCSSText': stub,
});

describe(`compile`, () => {
  let renderCSSTextStub: sinon.SinonStub;

  before(() => {
    configure({ friendlyClassNames: true });
  });

  beforeEach(() => {
    renderCSSTextStub = stub.default = sandbox.stub();
    resetUniqueId();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`calls renderCSSText with basic cssText`, () => {
    const className = compile({
      root: {
        backgroundColor: 'red',
        color: 'blue',
        padding: 5,
        display:'flex',
      },
    });
    expect(className).to.deep.equal({root: 'dapper-root-a'});
    expect(renderCSSTextStub).to.have.been.calledWith([`.dapper-root-a{background-color:red;color:blue;padding:5px;` +
      `display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex}`]);
  });

  it(`uses custom configuration`, () => {
    const className = compile({
      root: {
        backgroundColor: 'red',
        color: 'blue',
        padding: 5,
        display:'flex',
      },
    }, { classNamePrefix: 'dap-' });
    expect(className).to.deep.equal({root: 'dap-root-a'});
    expect(renderCSSTextStub).to.have.been.calledWith(sinon.match([sinon.match(/^.dap-root-a/)]));
  });

  it(`applies plugins`, () => {
    const className = compile({
      root: {
        padding: 4,
        flex:1,
        marginHorizontal: 5,
        marginVertical: 5,
        paddingHorizontal: 5,
        paddingVertical: 5,
      },
    });
    expect(className).to.deep.equal({root: 'dapper-root-a'});
    expect(renderCSSTextStub).to.have.been.calledWith([
      `.dapper-root-a{` +
        `-webkit-flex:1;-ms-flex:1;padding:4px;flex:1;` +
        `margin-left:5px;margin-right:5px;` +
        `margin-top:5px;margin-bottom:5px;` +
        `padding-left:5px;padding-right:5px;` +
        `padding-top:5px;padding-bottom:5px` +
      `}`]);
  });

  it(`applies plugins deeply`, () => {
    const className = compile({
      root: {
        blah: {
          flex:1,
          margin: 5,
          paddingHorizontal: 4,
        },
      },
    });
    expect(className).to.deep.equal({root: 'dapper-root-a'});
    expect(renderCSSTextStub).to.have.been.calledWith([
      `.dapper-root-a blah{` +
        `-webkit-flex:1;-ms-flex:1;flex:1;` +
        `margin:5px;` +
        `padding-left:4px;padding-right:4px` +
      `}`]);
  });

  it(`handles pseudo tags`, () => {
    const className = compile({
      root: {
        ':hover': {
          color: 'black',
          '::before': {
            content: '"a"',
          },
        },
      },
    });
    expect(className).to.deep.equal({root: 'dapper-root-a'});
    expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith([
      '.dapper-root-a:hover{color:black}',
      `.dapper-root-a:hover::before{content:"a"}`,
    ]);
  });

  it(`handles media queries`, () => {
    const className = compile({
      root: {
        '@media screen and (min-width: 500px)': {
          color: 'black',
        },
      },
    });
    expect(className).to.deep.equal({root: 'dapper-root-a'});
    expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith([
      '@media screen and (min-width: 500px){.dapper-root-a{color:black}}',
    ]);
  });

  it(`handles multiple media queries`, () => {
    const className = compile({
      root: {
        '@media screen and (min-width: 500px)': {
          '@media (max-width: 800px)': {
            color: 'black',
          },
        },
      },
    });
    expect(className).to.deep.equal({root: 'dapper-root-a'});
    expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith([
      '@media screen and (min-width: 500px) and (max-width: 800px){.dapper-root-a{color:black}}',
    ]);
  });

  it(`handles mode declarations`, () => {
    const className = compile({
      root: {
        $ghost: {
          color: 'red',
        },
      },
    });
    expect(typeof className.root).to.equal('function');
    expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith([
      '.dapper-root-a.dapper-root-ghost-b{color:red}',
    ]);
  });

  it(`handles deeply nested styling and renders in order`, () => {
    const className = compile({
      root: {
        color:'blue',
        ':hover': {
          color: 'red',
          '@media (min-width: 100px)': {
            color: 'green',
          },
        },
        backgroundColor: 'red',
      },
    });
    expect(className).to.deep.equal({root: 'dapper-root-a'});
    expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith([
      '.dapper-root-a{color:blue}',
      '.dapper-root-a:hover{color:red}',
      '@media (min-width: 100px){.dapper-root-a:hover{color:green}}',
      '.dapper-root-a{background-color:red}',
    ]);
  });

  it(`allows ancestor selectors`, () => {
    compile({
      root: {
        color: {
          background: 'red',
        },
      },
    });

    expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith([
      '.dapper-root-a color{background:red}',
    ]);
  });

  it(`throws on invalid object property`, () => {
    expect(() => {
      compile({
        root: {
          $mode: 'red',
        },
      });
    }).to.throw(Error);
  });

  it(`allows modes as children of property`, () => {
    const className = compile({
      root: {
        color: {
          $red: 'red',
          $blue: 'blue',
        },
      },
    });
    expect(typeof className.root).to.equal('function');
    expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith([
      '.dapper-root-a.dapper-root-red-b{color:red}',
      '.dapper-root-a.dapper-root-blue-c{color:blue}',
    ]);
  });

  it(`handles an array of values`, () => {
    const className = compile({
      root: {
        color:['blue', 'green'],
      },
    });
    expect(className).to.deep.equal({root: 'dapper-root-a'});
    expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith([
      '.dapper-root-a{color:blue;color:green}',
    ]);
  });

  it(`supports rule name replacement`, () => {
    const className = compile({
      root: {
        color: 'red',
      },
      child: {
        '{root}:hover &': {
          color: 'blue',
        },
      },
    });
    expect(className).to.deep.equal({root: 'dapper-root-a', child: 'dapper-child-b'});
    expect(renderCSSTextStub).to.have.been.calledWith([
      `.dapper-root-a{color:red}`,
      `.dapper-root-a:hover .dapper-child-b{color:blue}`,
    ]);
  });

  it(`throws if parent selector is child of pseudo`, () => {
    expect(() => compile({
      root: {
        ':hover': {
          $mode: {
            color: 'blue',
          },
        },
      },
    })).to.throw;
  });
});
