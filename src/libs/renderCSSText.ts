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
      // Gracefully continue despite invalid CSS rules in production
      try {
        sheet.insertRule(cssText, sheet.cssRules.length);
      } catch (e) {
        if (process.env.NODE_ENV === 'production') {
          console.error(e); // tslint:disable-line
        } else {
          throw e;
        }
      }
    });
  } else {
    node.textContent += cssTexts.join('\n') + '\n';
  }
}
