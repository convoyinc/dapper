import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

proxyquire.noCallThru();

const stub = { default: null as any };
const sandbox = sinon.sandbox.create();

const {default: renderStyle } = proxyquire('../../../src/libs/renderStyle', {
  './renderCSSText': stub,
});

describe(`libs/renderStyle`, () => {
  let renderCSSTextStub: sinon.SinonStub;

  beforeEach(() => {
    renderCSSTextStub = stub.default = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe(`renderStyle`, () => {
    it(`calls renderCSSText with basic cssText`, () => {
      renderStyle(
        ['root'],
        {
          backgroundColor: 'red',
          color: 'blue',
        },
        ['classname'],
        {},
        '',
        [],
      );
      expect(renderCSSTextStub).to.have.been.calledWith('.classname{background-color:red;color:blue}');
    });

    it(`applies plugins`, () => {
      renderStyle(
        ['root'],
        {
          padding: 4,
          flex:1,
        },
        ['classname'],
        {},
        '',
        [],
      );
      expect(renderCSSTextStub).to.have.been.calledWith('.classname{-webkit-flex:1;-ms-flex:1;padding:4px;flex:1}');
    });

    it(`handles pseudo tags`, () => {
      renderStyle(
        ['root'],
        {
          ':hover': {
            color: 'black',
            '::before': {
              content: 'a',
            },
          },
        },
        ['classname'],
        {},
        '',
        [],
      );
      expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith('.classname:hover{color:black}');
      expect(renderCSSTextStub.getCall(1)).to.have.been.calledWith(`.classname:hover::before{content:a}`);
    });

    it(`handles media queries`, () => {
      renderStyle(
        ['root'],
        {
          '@media screen and (min-width: 500px)': {
            color: 'black',
          },
        },
        ['classname'],
        {},
        '',
        [],
      );
      expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith(
        '@media screen and (min-width: 500px){.classname{color:black}}',
      );
    });

    it(`handles multiple media queries`, () => {
      renderStyle(
        ['root'],
        {
          '@media screen and (min-width: 500px)': {
            '@media (max-width: 800px)': {
              color: 'black',
            },
          },
        },
        ['classname'],
        {},
        '',
        [],
      );
      expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith(
        '@media screen and (min-width: 500px) and (max-width: 800px){.classname{color:black}}',
      );
    });

    it(`handles mode declarations`, () => {
      renderStyle(
        ['root'],
        {
          $ghost: {
            color: 'red',
          },
        },
        ['classname'],
        {},
        '',
        [],
      );
      expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith(
        '.classname.dapper-ah{color:red}',
      );
    });

    it(`handles deeply nested styling and renders in order`, () => {
      renderStyle(
        ['root'],
        {
          color:'blue',
          ':hover': {
            color: 'red',
            '@media (min-width: 100px)': {
              color: 'green',
            },
          },
          backgroundColor: 'red',
        },
        ['classname'],
        {},
        '',
        [],
      );
      expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith(
        '.classname{color:blue}',
      );
      expect(renderCSSTextStub.getCall(1)).to.have.been.calledWith(
        '.classname:hover{color:red}',
      );
      expect(renderCSSTextStub.getCall(2)).to.have.been.calledWith(
        '@media (min-width: 100px){.classname:hover{color:green}}',
      );
      expect(renderCSSTextStub.getCall(3)).to.have.been.calledWith(
        '.classname{background-color:red}',
      );
    });

    it(`throws on invalid object property`, () => {
      expect(() => renderStyle(
        ['root'],
        {
          color: {
            background: 'red',
          },
        },
        ['classname'],
        {},
        '',
        [],
      )).to.throw(Error);
    });

    it(`handles an array of values`, () => {
      renderStyle(
        ['root'],
        {
          color:['blue', 'green'],
        },
        ['classname'],
        {},
        '',
        [],
      );
      expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith(
        '.classname{color:blue;color:green}',
      );
    });
  });
});
