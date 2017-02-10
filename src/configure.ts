export interface Configuration {
  node: HTMLStyleElement;
  classNamePrefix: string;
  keyframePrefixes: string[];
}

export let config: Configuration = {
  node: document.createElement('style'),
  classNamePrefix: 'dapper_',
  keyframePrefixes: ['-webkit-', '-moz-'],
};

export default function configure(cfg: Configuration) {
  Object.assign(config, cfg);
};
