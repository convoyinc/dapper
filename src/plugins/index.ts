import horizontalVertical from './horizontalVertical';
import prefixer from './prefixer';
import unit from './unit';
import { StyleRule } from '../types';

export default function apply(style: StyleRule) {
  style = unit(style);
  style = prefixer(style);
  style = horizontalVertical(style);
  return style;
}
