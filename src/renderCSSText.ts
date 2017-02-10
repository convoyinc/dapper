import { config } from './configure';

export default function renderCSSText(cssText: string) {
  if (process.env.NODE_ENV === 'production') {
    config.node.sheet.insertRule(cssText, config.node.sheet.cssRules.length);
  } else {
    config.node.textContent += cssText + '\n';
  }
}
