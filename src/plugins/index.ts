import prefixer from './prefixer';
import unit from './unit';
import { Style } from '../types';

export default function apply(style: Style) {
  style = unit(style);
  style = prefixer(style);
  return style;
}
