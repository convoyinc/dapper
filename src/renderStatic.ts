import { config as defaultConfig, Configuration } from './configure';
import cssTextForStyles from './libs/cssTextForStyles';
import renderCSSText from './libs/renderCSSText';
import { StyleDeclaration } from './types';

export default function renderStatic(styles: StyleDeclaration<string>, config: Configuration = defaultConfig) {
  config = { ...defaultConfig, ...config };
  const cssText = cssTextForStyles(styles);
  renderCSSText(cssText, config);
}
