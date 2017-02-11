import generateCSSDeclaration from './generateCSSDeclaration';
import { Style } from '../types';

export default function cssifyObject(style: Style) {
  const declarations: string[] = [];

  for (const property in style) {
    const value = style[property];
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new Error(`The invalid value \`${value}\` has been used as \`${property}\`.`);
    }

    declarations.push(generateCSSDeclaration(property, value));
  }

  return declarations.join(';');
}
