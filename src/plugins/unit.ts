import * as isUnitlessCSSProperty from 'unitless-css-property';

import { Style } from '../types';

export default function addUnit(style: Style, unit = 'px') {
  for (const property in style) {
    if (isUnitlessCSSProperty(property)) continue;

    const cssValue = style[property];
    if (Array.isArray(cssValue)) {
      style[property] = cssValue.map(val => addUnitIfNeeded(val, unit));
    } else if (cssValue instanceof Object) {
      style[property] = addUnit(cssValue as Style, unit);
    } else {
      style[property] = addUnitIfNeeded(cssValue, unit);
    }
  }

  return style;
}

function addUnitIfNeeded(value: string|number, unit: string) {
  if (typeof value === 'number') {
    return value + unit;
  }
  /* tslint:disable:triple-equals */
  if (typeof value === 'string' && value == parseFloat(value) as any) {
    return value + unit;
  }
  /* tslint:enable:triple-equals */
  return value;
}
