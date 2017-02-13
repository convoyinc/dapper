import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';
import configure from '../../src/configure';
import { resetUniqueId } from '../../src/libs/generateClassName';

proxyquire.noCallThru();

const stub = { default: null as any };
const sandbox = sinon.sandbox.create();

const renderStyle = proxyquire('../../src/libs/renderStyle', {
  './renderCSSText': stub,
});

const {default: renderStatic } = proxyquire('../../src/renderStatic', {
  './libs/renderStyle': renderStyle,
});

describe(`renderStatic`, () => {
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
    renderStatic({
      'html, body': {
        backgroundColor: 'red',
        color: 'blue',
      },
    });
    expect(renderCSSTextStub).to.have.been.calledWith('html, body{background-color:red;color:blue}');
  });
});
