import * as _ from 'lodash';

import { Configuration } from '../configure';
import { StyleRule } from '../types';
import { compileRule } from './compileRule';
import renderCSSText from './renderCSSText';

export type Modes<TModes extends string> = {
  [Mode in TModes]: StyleRule;
};

export function compileModes(render: (cssTexts: string[], config: Configuration) => void) {
  return function compileModes<TModes extends string>(
    displayName: string,
    modes: Modes<TModes>,
    config: Configuration,
  ) {
    const functionRules: {
      [key: string]: {
        [key: string]: Function,
      },
    } = {};
    const classNames = _.mapValues(modes, (mode: StyleRule,  name: string) => {
      const newRule: StyleRule = {};
      const functionRule: {[key: string]: Function} = {};

      for (const key in mode) {
        const value = mode[key];
        if (typeof value === 'function') {
          functionRule[key] = value;
        } else {
          newRule[key] = value;
        }
      }

      const modeClassName = compileRule(render)(newRule, [displayName, name], config);

      if (!_.isEmpty(functionRule)) {
        functionRules[name] = functionRule;
      }

      return modeClassName;
    });

    return { classNames, functionRules };
  };
}
export default compileModes(renderCSSText);
