import * as hyphenateStyleName from 'hyphenate-style-name';

export default function generateCSSDeclaration(property: string, value: string|number|undefined) {
  if (value === undefined) return '';
  return `${hyphenateStyleName(property)}:${value}`;
}
