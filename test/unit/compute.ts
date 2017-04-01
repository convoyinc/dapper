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

const {default: compute } = proxyquire('../../src/compute', {
  './compile': {default: compile},
});

describe(`compute`, () => {
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

  it(`handles mode declarations`, () => {
    const className = compile({
      root: {
        $ghost: {
          color: 'red',
        },
      },
    });
    const styles = compute(className, {
      ghost: () => true,
    }, {});
    expect(styles['root']).to.equal('dapper-root-a dapper-root-ghost-b');
    expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith([
      '.dapper-root-a.dapper-root-ghost-b{color:red}',
    ]);
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
    const styles = compute(className, {
      red: () => false,
      blue: () => true,
    }, {});
    expect(styles['root']).to.equal('dapper-root-a dapper-root-blue-c');
    expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith([
      '.dapper-root-a.dapper-root-red-b{color:red}',
      '.dapper-root-a.dapper-root-blue-c{color:blue}',
    ]);
  });

  it(`can directly compute declarations`, () => {
    const styles = compute({
      root: {
        color: 'red',
      },
    });
    expect(styles['root']).to.equal('dapper-root-a');
    expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith([
      '.dapper-root-a{color:red}',
    ]);
  });

  it(`throws if given mode declarations but no state`, () => {
    const className = compile({
      root: {
        $ghost: {
          color: 'red',
        },
      },
    });
    expect(() => {
      compute(className, {
        ghost: () => true,
      });
    }).to.throw;
  });
});
