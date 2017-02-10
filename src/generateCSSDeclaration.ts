import * as hyphenateStyleName from 'hyphenate-style-name';

export default function generateCSSDeclaration(property: string, value: string|number) {
  return `${hyphenateStyleName(property)}:${value}`;
}
