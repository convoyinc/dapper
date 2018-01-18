import * as sinon from 'sinon';
import configure from '../../src/configure';
import { resetUniqueId } from '../../src/libs/generateClassName';
import { _compile } from '../../src/compile';

const sandbox = sinon.sandbox.create();

describe(`configure`, () => {
  let renderCSSTextStub: sinon.SinonStub;

  beforeEach(() => {
    renderCSSTextStub = sandbox.stub();
    resetUniqueId();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`friendlyClassNames set to false doesn't add name`, () => {
    configure({ friendlyClassNames: false });

    const className = _compile(renderCSSTextStub)({
      root: {
        backgroundColor: 'red',
        color: 'blue',
      },
    });
    expect(className).to.deep.equal({root: 'dapper-a'});
    expect(renderCSSTextStub).to.have.been.calledWith(['.dapper-a{background-color:red;color:blue}']);
  });
});
