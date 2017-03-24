import * as isUnitlessCSSProperty from 'unitless-css-property';

import { StyleRule } from '../types';

export default function addUnit(style: StyleRule, unit = 'px') {
  for (const property in style) {
    if (isUnitlessCSSProperty(property)) continue;

    const cssValue = style[property];
    if (Array.isArray(cssValue)) {
      style[property] = cssValue.map(val => addUnitIfNeeded(val, unit));
    } else if (typeof cssValue === 'object') {
      style[property] = addUnit(cssValue as StyleRule, unit);
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
