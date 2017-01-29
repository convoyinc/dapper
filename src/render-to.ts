let styleNode: HTMLStyleElement|undefined;

export default function renderTo(
  node: HTMLStyleElement,
) {
  styleNode = node;
};

export function _renderToNode(cssRule: string) {
  if (!styleNode) {
    styleNode = document.createElement('style');
    document.head.appendChild(styleNode);
  }
  styleNode.sheet.insertRule(cssRule, styleNode.sheet.cssRules.length);
}
