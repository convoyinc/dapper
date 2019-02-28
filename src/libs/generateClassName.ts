import { Configuration } from '../configure';

let uniqueRuleIdentifier = 0;

const CHARS = 'abcdefghijklmnopqrstuvwxyz';
const CHAR_LENGTH = CHARS.length;

export default function generateClassName(ids: string[], config: Configuration) {
  const friendlyName = config.friendlyClassNames ? ids.join('-') : '';
  return `${config.classNamePrefix}${friendlyName}${_generateSuffix(config)}`;
}

function _generateSuffix(config: Configuration) {
  if (config.omitUniqueSuffices) return '';
  const uniqueSuffix = _generateClassName(++uniqueRuleIdentifier);
  return config.friendlyClassNames ? `-${uniqueSuffix}` : uniqueSuffix;
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
