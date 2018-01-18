import * as sinon from 'sinon';
import configure from '../../src/configure';
import { keyframes, resetUniqueId } from '../../src/keyframes';

const sandbox = sinon.sandbox.create();

describe(`keyframes`, () => {
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

  it(`calls renderCSSText with basic cssText`, () => {
    const fadeOut = keyframes(renderCSSTextStub)({
      '0%': {
        opacity: 0,
      },
      '100%': {
        opacity: 1,
      },
    });
    expect(fadeOut).to.equal('dapper-anim-1');
    expect(renderCSSTextStub).to.have.been.calledWith([
      '@keyframes dapper-anim-1{0%{opacity:0}100%{opacity:1}}',
    ]);
  });
});
