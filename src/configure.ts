export interface Configuration {
  node: HTMLStyleElement|null;
  classNamePrefix: string;
  friendlyClassNames: boolean;
  useInsertRule: boolean;
  stableSuffices: boolean;
  shortenStableSuffices: boolean;
}

export let config: Configuration = Object.freeze({
  node: null,
  classNamePrefix: process.env.NODE_ENV === 'production' ? 'd-' : 'dapper-',
  friendlyClassNames: process.env.NODE_ENV !== 'production',
  useInsertRule: process.env.NODE_ENV !== 'development',
  stableSuffices: false,
  shortenStableSuffices: false,
});

export default function configure(cfg: Partial<Configuration>) {
  config = Object.freeze(Object.assign({}, config, cfg));
};
