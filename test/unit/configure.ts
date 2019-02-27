import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';
import configure from '../../src/configure';
import { resetUniqueId } from '../../src/libs/generateClassName';
import keyframes from '../../src/keyframes';

proxyquire.noCallThru();

const stub = { default: null as any };
const sandbox = sinon.sandbox.create();

const {default: compile } = proxyquire('../../src/compile', {
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
    configure({ omitUniqueSuffices: false });
  });

  it(`friendlyClassNames set to false doesn't add name`, () => {
    configure({ friendlyClassNames: false });

    const className = compile({
      root: {
        backgroundColor: 'red',
        color: 'blue',
      },
    });
    expect(className).to.deep.equal({root: 'dapper-a'});
    expect(renderCSSTextStub).to.have.been.calledWith(['.dapper-a{background-color:red;color:blue}']);
  });

  it(`omitUniqueSuffices omits unique sufficies for class names and keyframes`, () => {
    const fadeOut1 = keyframes({
      '0%': {
        opacity: 0,
      },
      '100%': {
        opacity: 1,
      },
    });
    const className1 = compile({
      root: {
        backgroundColor: 'red',
        color: 'blue',
      },
    });
    expect(fadeOut1).to.equal('dapper-anim-1');
    expect(className1).to.deep.equal({root: 'dapper-a'});

    configure({ omitUniqueSuffices: true });

    const fadeOut2 = keyframes({
      '0%': {
        opacity: 0,
      },
      '100%': {
        opacity: 1,
      },
    });
    const className2 = compile({
      root: {
        backgroundColor: 'red',
        color: 'blue',
      },
    });
    expect(fadeOut2).to.equal('dapper-anim-');
    expect(className2).to.deep.equal({root: 'dapper-'});
  });
});
