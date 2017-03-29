import { config as defaultConfig, Configuration } from './configure';
import cssTextForStyles from './libs/cssTextForStyles';
import renderCSSText from './libs/renderCSSText';
import { StyleDeclaration } from './types';

export default function renderStatic(
  styles: StyleDeclaration<string>,
  configOverride: Partial<Configuration> = defaultConfig,
) {
  const config = { ...defaultConfig, ...configOverride } as Configuration;
  const cssText = cssTextForStyles(styles);
  renderCSSText(cssText, config);
}
