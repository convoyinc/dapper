import { StyleRule } from '../types';
import { Configuration } from '../configure';
import generateClassName from './generateClassName';
import cssTextForStyles from './cssTextForStyles';
import renderCSSText from './renderCSSText';

export function compileRule(render: (cssTexts: string[], config: Configuration) => void) {
  return function compileRule(
    styleRule: StyleRule,
    keys: string[],
    config: Configuration,
  ) {
    const name = generateClassName(keys, config);

    const newKey = `.${name}`;
    const cssText = cssTextForStyles({ [newKey]: styleRule });
    render(cssText, config);

    return name;
  };
}
export default compileRule(renderCSSText);
