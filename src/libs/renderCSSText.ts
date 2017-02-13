import configure, { config } from '../configure';

export default function renderCSSText(cssText: string) {
  let node = config.node;
  if (!node) {
    node = document.createElement('style');
    configure({ node });
    document.head.appendChild(node);
  }

  if (process.env.NODE_ENV === 'production') {
    node.sheet.insertRule(cssText, node.sheet.cssRules.length);
  } else {
    node.textContent += cssText + '\n';
  }
}
