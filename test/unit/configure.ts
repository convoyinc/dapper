import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';
import configure from '../../src/configure';
import { resetUniqueId } from '../../src/libs/generateClassName';

proxyquire.noCallThru();

const stub = { default: null as any };
const sandbox = sinon.sandbox.create();

const {default: compute } = proxyquire('../../src/compute', {
  './libs/renderCSSText': stub,
});

describe(`configure`, () => {
  let renderCSSTextStub: sinon.SinonStub;

  beforeEach(() => {
    renderCSSTextStub = stub.default = sandbox.stub();
    resetUniqueId();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`friendlyClassNames set to false doesn't add name`, () => {
    configure({ friendlyClassNames: false });

    compute({
      root: {
        backgroundColor: 'red',
        color: 'blue',
      },
    });
    expect(renderCSSTextStub).to.have.been.calledWith(['.dapper-a{background-color:red;color:blue}']);
  });
});
