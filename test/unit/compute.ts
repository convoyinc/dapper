import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';
import configure from '../../src/configure';
import { resetUniqueId } from '../../src/libs/generateClassName';
import * as dapper from '../../src';

proxyquire.noCallThru();

const stub = { default: null as any };
const sandbox = sinon.sandbox.create();

const {default: create } = proxyquire('../../src/create', {
  './libs/renderCSSText': stub,
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
    const className = create({
      root: {
        $ghost: {
          color: 'red',
        },
      },
    });
    const styles = dapper.compute(className, {
      ghost: () => true,
    }, null);
    expect(styles['root']).to.equal('dapper-root-a dapper-root-ghost-b');
    expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith([
      '.dapper-root-a.dapper-root-ghost-b{color:red}',
    ]);
  });

  it(`allows modes as children of property`, () => {
    const className = create({
      root: {
        color: {
          $red: 'red',
          $blue: 'blue',
        },
      },
    });
    const styles = dapper.compute(className, {
      red: () => false,
      blue: () => true,
    }, null);
    expect(styles['root']).to.equal('dapper-root-a dapper-root-blue-c');
    expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith([
      '.dapper-root-a.dapper-root-red-b{color:red}',
      '.dapper-root-a.dapper-root-blue-c{color:blue}',
    ]);
  });
});
