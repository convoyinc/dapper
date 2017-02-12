import * as _ from 'lodash';
import * as proxyquire from 'proxyquire';

proxyquire.noCallThru();

const config: any = {};

const {default: generateClassName } = proxyquire('../../../src/libs/generateClassName', {
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
      const classNames = _.range(0, 30).map(() => generateClassName(['hello']));
      expect(_.uniq(classNames).length).to.be.equal(30);
      expect(classNames[0].substr(0, 13)).to.be.equal('dapper-hello-');
    });

    it(`uses configured prefix`, () => {
      config.classNamePrefix = 'dap-';
      const className = generateClassName(['hello']);
      expect(className.substr(0, 10)).to.be.equal('dap-hello-');
    });

    it(`uses doesn't use friendly className if configured`, () => {
      config.friendlyClassNames = false;
      const className = generateClassName(['hello']);
      expect(className.substr(0, 7)).to.be.equal('dapper-');
    });
  });
});
