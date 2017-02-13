export interface Configuration {
  node: HTMLStyleElement|null;
  classNamePrefix: string;
  keyframePrefixes: string[];
  friendlyClassNames: boolean;
}

export let config: Configuration = Object.freeze({
  node: null,
  classNamePrefix: process.env.NODE_ENV === 'production' ? 'd-' : 'dapper-',
  keyframePrefixes: ['-webkit-', '-moz-'],
  friendlyClassNames: process.env.NODE_ENV !== 'production',
});

export default function configure(cfg: Partial<Configuration>) {
  config = Object.freeze(Object.assign({}, config, cfg));
};
