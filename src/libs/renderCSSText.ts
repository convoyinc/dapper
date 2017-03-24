import configure, { Configuration } from '../configure';

export default function renderCSSText(cssTexts: string[], config: Configuration) {
  let node = config.node;
  if (!node) {
    node = document.createElement('style');
    configure({ node });
    document.head.appendChild(node);
  }

  if (config.useInsertRule) {
    const sheet = node.sheet as CSSStyleSheet;
    cssTexts.forEach(cssText => {
      sheet.insertRule(cssText, sheet.cssRules.length);
    });
  } else {
    node.textContent += cssTexts.join('\n') + '\n';
  }
}
