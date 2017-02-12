export interface Configuration {
  node: HTMLStyleElement;
  classNamePrefix: string;
  keyframePrefixes: string[];
  friendlyClassNames: boolean;
}

export let config: Configuration = {
  node: document.createElement('style'),
  classNamePrefix: process.env.NODE_ENV === 'production' ? 'd-' : 'dapper-',
  keyframePrefixes: ['-webkit-', '-moz-'],
  friendlyClassNames: process.env.NODE_ENV !== 'production',
};

export default function configure(cfg: Configuration) {
  Object.assign(config, cfg);
};
