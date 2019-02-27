import * as _ from 'lodash';
import * as proxyquire from 'proxyquire';
import { config as defaultConfig } from '../../../src/configure';

proxyquire.noCallThru();

const config: any = {};
const { default: generateClassName } = proxyquire('../../../src/libs/generateClassName', {
  '../configure': {
    config,
  },
});

describe(`libs/generateClassName`, () => {

  beforeEach(() => {
    config.friendlyClassNames = true;
    config.classNamePrefix = 'dapper-';
  });

  describe(`generateClassName`, () => {
    it(`generates a new className each time`, () => {
      const classNames = _.range(0, 30).map(() => generateClassName(['hello'], defaultConfig));
      expect(_.uniq(classNames).length).to.be.equal(30);
      expect(classNames[0].substr(0, 13)).to.be.equal('dapper-hello-');
    });

    it(`uses configured prefix`, () => {
      const className = generateClassName(['hello'], { ...defaultConfig, classNamePrefix: 'dap-' });
      expect(className.substr(0, 10)).to.be.equal('dap-hello-');
    });

    it(`uses doesn't use friendly className if configured`, () => {
      const className = generateClassName(['hello'], { ...defaultConfig, friendlyClassNames: false });
      expect(className.substr(0, 7)).to.be.equal('dapper-');
    });
  });
});
