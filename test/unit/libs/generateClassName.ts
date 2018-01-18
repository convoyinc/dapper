import * as _ from 'lodash';
import { default as configure, config as defaultConfig } from '../../../src/configure';
import generateClassName from '../../../src/libs/generateClassName';

describe(`libs/generateClassName`, () => {

  beforeEach(() => {
    configure({
      friendlyClassNames: true,
      classNamePrefix: 'dapper-',
    });
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
