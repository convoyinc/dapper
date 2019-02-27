export interface Configuration {
  node: HTMLStyleElement|null;
  classNamePrefix: string;
  friendlyClassNames: boolean;
  useInsertRule: boolean;
  omitUniqueSuffices: boolean;
}

export let config: Configuration = Object.freeze({
  node: null,
  classNamePrefix: process.env.NODE_ENV === 'production' ? 'd-' : 'dapper-',
  friendlyClassNames: process.env.NODE_ENV !== 'production',
  useInsertRule: process.env.NODE_ENV !== 'development',
  omitUniqueSuffices: false,
});

export default function configure(cfg: Partial<Configuration>) {
  config = Object.freeze(Object.assign({}, config, cfg));
};
