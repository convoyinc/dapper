import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';
import configure from '../../src/configure';
import { resetUniqueId } from '../../src/libs/generateClassName';

proxyquire.noCallThru();

const stub = { default: null as any };
const sandbox = sinon.sandbox.create();

const {default: renderStatic } = proxyquire('../../src/renderStatic', {
  './libs/renderCSSText': stub,
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
    expect(renderCSSTextStub).to.have.been.calledWith(['html, body{background-color:red;color:blue}']);
  });

  it(`handles class names`, () => {
    renderStatic({
      '.hello': {
        backgroundColor: 'red',
        color: 'blue',
      },
    });
    expect(renderCSSTextStub).to.have.been.calledWith(['.hello{background-color:red;color:blue}']);
  });

  it(`handles cascading selectors`, () => {
    renderStatic({
      h1: {
        '.dude': {
          padding: 5,
        },
      },
    });
    expect(renderCSSTextStub).to.have.been.calledWith(['h1 .dude{padding:5px}']);
  });

  it(`handles cascading selectors with multiple parent selectors`, () => {
    renderStatic({
      h1: {
        '&.blah': {
          '.dude': {
            '&.food': {
              padding: 5,
            },
          },
        },
      },
    });
    expect(renderCSSTextStub).to.have.been.calledWith(['h1.blah .dude.food{padding:5px}']);
  });

  it(`handles parent selectors`, () => {
    renderStatic({
      h1: {
        '&.blah': {
          backgroundColor: 'red',
        },
      },
    });
    expect(renderCSSTextStub).to.have.been.calledWith(['h1.blah{background-color:red}']);
  });

  it(`handles parent selectors as children of property`, () => {
    renderStatic({
      h1: {
        padding: {
          '&.blah': 4,
          '&.dude': 5,
        },
      },
    });
    expect(renderCSSTextStub).to.have.been.calledWith(['h1.blah{padding:4px}', 'h1.dude{padding:5px}']);
  });

  it(`Errors on no selector`, () => {
    expect(() => {
      renderStatic({
        padding: 5,
      });
    }).to.throw(Error);
  });

  it.skip(`Handles classnames as children of property`, () => {
    renderStatic({
      h1: {
        padding: {
          '.blah': 4,
        },
      },
    });
    expect(renderCSSTextStub).to.have.been.calledWith(['h1 .blah{padding:4px}']);
  });

  it(`Handles pseudo classes`, () => {
    renderStatic({
      h1: {
        ':hover': {
          padding: 4,
        },
        ':focus': {
          padding: 5,
        },
      },
    });
    expect(renderCSSTextStub).to.have.been.calledWith(['h1:hover{padding:4px}', 'h1:focus{padding:5px}']);
  });
});
