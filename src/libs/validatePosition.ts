import { StyleRule } from '../types';

export default function validatePosition(styleRule: StyleRule): string|false {
  for (const key in styleRule) {
    const value = styleRule[key];

    if (key.charAt(0) === ':' || key.charAt(0) === '@') {
      return validatePosition(value);
    }

    if (!positionProperties[key]) {
      return key;
    }
  }
  return false;
}

const positionProperties: {[key: string]: number} = {
  alignSelf: 1,
  alignmentAdjust: 1,
  alignmentBaseline: 1,
  animationDelay: 1,
  animationDirection: 1,
  animationIterationCount: 1,
  animationName: 1,
  animationPlayState: 1,
  backfaceVisibility: 1,
  bottom: 1,
  breakAfter: 1,
  breakBefore: 1,
  breakInside: 1,
  clear: 1,
  display: 1,
  flex: 1,
  flexBasis: 1,
  flexGrow: 1,
  flexOrder: 1,
  flexShrink: 1,
  float: 1,
  gridArea: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnStart: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowPosition: 1,
  gridRowSpan: 1,
  height: 1,
  left: 1,
  margin: 1,
  marginBottom: 1,
  marginLeft: 1,
  marginRight: 1,
  marginTop: 1,
  maxHeight: 1,
  maxWidth: 1,
  minHeight: 1,
  minWidth: 1,
  opacity: 1,
  pageBreakAfter: 1,
  pageBreakBefore: 1,
  pageBreakInside: 1,
  perspective: 1,
  perspectiveOrigin: 1,
  position: 1,
  right: 1,
  top: 1,
  transform: 1,
  transformOrigin: 1,
  transformOriginZ: 1,
  transformStyle: 1,
  transition: 1,
  transitionDelay: 1,
  transitionDuration: 1,
  transitionProperty: 1,
  verticalAlign: 1,
  visibility: 1,
  width: 1,
  zIndex: 1,
};
