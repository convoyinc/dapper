import * as _ from 'lodash';
export interface Configuration {
  node: HTMLStyleElement|null;
  classNamePrefix: string;
  friendlyClassNames: boolean;
  useInsertRule: boolean;
  verifyModes: boolean;
}

export let config: Configuration = Object.freeze({
  node: null,
  classNamePrefix: _.get(process, 'env.NODE_ENV') === 'production' ? 'd-' : 'dapper-',
  friendlyClassNames: _.get(process, 'env.NODE_ENV') !== 'production',
  useInsertRule: _.get(process, 'env.NODE_ENV') === 'production',
  verifyModes: _.get(process, 'env.NODE_ENV') !== 'production',
});

export default function configure(cfg: Partial<Configuration>) {
  config = Object.freeze(Object.assign({}, config, cfg));
};
