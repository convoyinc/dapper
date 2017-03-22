import * as prefix from 'inline-style-prefixer/static';

import { StyleRule } from '../types';

export default function prefixer(style: StyleRule): StyleRule {
  return prefix(style);
}
