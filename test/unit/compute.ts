import * as sinon from 'sinon';
import configure from '../../src/configure';
import { resetUniqueId } from '../../src/libs/generateClassName';
import { _compile } from '../../src/compile';
import { _compute } from '../../src/compute';

const sandbox = sinon.sandbox.create();

describe(`compute`, () => {
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

  it(`handles mode declarations`, () => {
    const className = _compile(renderCSSTextStub)({
      root: {
        $ghost: {
          color: 'red',
        },
      },
    });
    const styles = _compute(renderCSSTextStub)(className, {
      ghost: () => true,
    }, {});
    expect(styles['root']).to.equal('dapper-root-a dapper-root-ghost-b');
    expect(renderCSSTextStub.getCall(0)).to.have.been.calledWith([
      '.dapper-root-a.dapper-root-ghost-b{color:red}',
    ]);
  });

  it(`allows modes as children of property`, () => {
    const className = _compile(renderCSSTextStub)({
      root: {
        color: {
          $red: 'red',
          $blue: 'blue',
        },
      },
    });
    const styles = _compute(renderCSSTextStub)(className, {
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
    const styles = _compute(renderCSSTextStub)({
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
    const className = _compile(renderCSSTextStub)({
      root: {
        $ghost: {
          color: 'red',
        },
      },
    });
    expect(() => {
      _compute(renderCSSTextStub)(className, {
        ghost: () => true,
      });
    }).to.throw;
  });
});
