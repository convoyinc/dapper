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

export function _renderToNode(cssRule: string) {
  if (!config.node.parentNode) {
    document.head.appendChild(config.node);
  }
  if (process.env.NODE_ENV === 'production') {
    config.node.sheet.insertRule(cssRule, config.node.sheet.cssRules.length);
  } else {
    config.node.textContent += cssRule + '\n';
  }
}
