import { Configuration } from '../configure';
import {
  StyleRuleValue,
} from '../types';
import createStableSuffix from '../createStableSuffix';

let uniqueRuleIdentifier = 0;

const CHARS = 'abcdefghijklmnopqrstuvwxyz';
const CHAR_LENGTH = CHARS.length;

export default function generateClassName(ids: string[], value: StyleRuleValue, config: Configuration) {
  const friendlyName = config.friendlyClassNames ? ids.map(id => `${id}-`).join('') : '';
  const suffix = config.stableSuffices
    ? createStableSuffix({ ids, value }, config)
    : _generateClassName(++uniqueRuleIdentifier);
  return config.classNamePrefix + friendlyName + suffix;
}

function _generateClassName(id: number, className = ''): string {
  if (id <= CHAR_LENGTH) {
    return CHARS[id - 1] + className;
  }

  // Bitwise floor as safari performs much faster https://jsperf.com/math-floor-vs-math-round-vs-parseint/55
  return _generateClassName(id / CHAR_LENGTH | 0, CHARS[id % CHAR_LENGTH] + className);
}

export function resetUniqueId() {
  uniqueRuleIdentifier = 0;
}
