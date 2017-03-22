import { StyleRule } from '../types';

export default function horizontalVertical(style: StyleRule) {
  for (const property in style) {
    if (property === 'paddingHorizontal') {
      style['paddingLeft'] = style[property];
      style['paddingRight'] = style[property];
      delete style[property];
    } else if (property === 'paddingVertical') {
      style['paddingTop'] = style[property];
      style['paddingBottom'] = style[property];
      delete style[property];
    } else if (property === 'marginHorizontal') {
      style['marginLeft'] = style[property];
      style['marginRight'] = style[property];
      delete style[property];
    } else if (property === 'marginVertical') {
      style['marginTop'] = style[property];
      style['marginBottom'] = style[property];
      delete style[property];
    }
  }
  return style;
}
