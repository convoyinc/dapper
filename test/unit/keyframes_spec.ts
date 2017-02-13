import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';
import configure from '../../src/configure';
import { resetUniqueId } from '../../src/keyframes';

proxyquire.noCallThru();

const stub = { default: null as any };
const sandbox = sinon.sandbox.create();

const {default: keyframes } = proxyquire('../../src/keyframes', {
  './libs/renderCSSText': stub,
});

describe(`keyframes`, () => {
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
    const fadeOut = keyframes({
      '0%': {
        opacity: 0,
      },
      '100%': {
        opacity: 1,
      },
    });
    expect(fadeOut).to.equal('dapper-anim-1');
    expect(renderCSSTextStub).to.have.been.calledWith(`@-webkit-keyframes dapper-anim-1` +
      `{0%{opacity:0}100%{opacity:1}}@-moz-keyframes dapper-anim-1{0%{opacity:0}100%{opacity:1}}`);
  });
});
