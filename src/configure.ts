export let config: Configuration = {
  node: document.createElement('style'),
  classNamePrefix: 'dap_',
};

export interface Configuration {
  node: HTMLStyleElement;
  classNamePrefix: string;
}

export default function configure(cfg: Configuration) {
  Object.assign(config, cfg);
};
