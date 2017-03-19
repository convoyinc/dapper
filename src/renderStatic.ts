import cssTextForStyles from './libs/cssTextForStyles';
import renderCSSText from './libs/renderCSSText';
import { Styles } from './types';

export default function renderStatic(styles: Styles) {
  const cssText = cssTextForStyles(styles);
  renderCSSText(cssText);
}
