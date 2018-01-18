import { config as defaultConfig, Configuration } from './configure';
import cssTextForStyles from './libs/cssTextForStyles';
import renderCSSText from './libs/renderCSSText';
import { StyleDeclaration } from './types';

export function renderStatic(render: (cssTexts: string[], config: Configuration) => void) {
  return function renderStatic(
    styles: StyleDeclaration<string>,
    configOverride: Partial<Configuration> = defaultConfig,
  ) {
    const config = { ...defaultConfig, ...configOverride } as Configuration;
    const cssText = cssTextForStyles(styles);
    render(cssText, config);
  };
}

export default renderStatic(renderCSSText);
