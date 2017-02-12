import { config } from '../configure';

export default function renderCSSText(cssText: string) {
  if (!config.node.parentNode) {
    document.head.appendChild(config.node);
  }

  if (process.env.NODE_ENV === 'production') {
    config.node.sheet.insertRule(cssText, config.node.sheet.cssRules.length);
  } else {
    config.node.textContent += cssText + '\n';
  }
}
