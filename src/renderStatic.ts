import renderStyle from './libs/renderStyle';
import { Styles } from './types';

export default function renderStatic(styles: Styles) {
  for (const selector in styles) {
    renderStyle([selector], styles[selector], [selector], {});
  }
}
