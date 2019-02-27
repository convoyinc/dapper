import configure from '../../src/configure';
import keyframes from '../../src/keyframes';
import resetUniqueIdentifierCounters from '../../src/resetUniqueIdentifierCounters';
import generateClassName from '../../src/libs/generateClassName';
import { config as defaultConfig } from '../../src/configure';

describe(`resetUniqueIdentifierCounters`, () => {
  before(() => {
    configure({ friendlyClassNames: true });
  });

  beforeEach(() => {
    resetUniqueIdentifierCounters();
  });

  it(`calls renderCSSText with basic cssText`, () => {
    const fadeOut1 = keyframes({
      '0%': {
        opacity: 0,
      },
      '100%': {
        opacity: 1,
      },
    });
    const fadeOut2 = keyframes({
      '0%': {
        opacity: 0,
      },
      '100%': {
        opacity: 1,
      },
    });
    expect(fadeOut1).to.equal('dapper-anim-1');
    expect(fadeOut2).to.equal('dapper-anim-2');

    const cn1 = generateClassName(['hello'], defaultConfig);
    const cn2 = generateClassName(['hello'], defaultConfig);
    expect(cn1).to.equal('dapper-hello-a');
    expect(cn2).to.equal('dapper-hello-b');

    resetUniqueIdentifierCounters();
    const fadeOut3 = keyframes({
      '0%': {
        opacity: 0,
      },
      '100%': {
        opacity: 1,
      },
    });
    const cn3 = generateClassName(['hello'], defaultConfig);
    expect(fadeOut3).to.equal('dapper-anim-1');
    expect(cn3).to.equal('dapper-hello-a');
  });
});
