import cssTextForStyles from './libs/cssTextForStyles';
import renderCSSText from './libs/renderCSSText';
import { StyleDeclaration } from './types';

export default function renderStatic(styles: StyleDeclaration) {
  const cssText = cssTextForStyles(styles);
  renderCSSText(cssText);
}
