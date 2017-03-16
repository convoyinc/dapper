import * as _ from 'lodash';

import applyPlugins from '../plugins';
import generateCSSDeclaration from './generateCSSDeclaration';
import { Style, Styles } from '../types';

interface Selector {
  selectors: string[];
  pseudos: string[];
}

// Given LESS-like styles { '.className': { '&.modeClassName': { fontSize: 5 }}}
// Returns CSS text to render
export default function cssTextForStyles(styles: Styles): string[] {
  let cssTexts: string[] = [];
  _.forEach(styles, (style, className: string) => {
    style = applyPlugins(style);
    const selector = { selectors: [className], pseudos: [] };
    cssTexts = cssTexts.concat(cssTextForStyle(style, [selector]));
  });
  return cssTexts;
}

function cssTextForStyle(
  style: Style,
  selectors: Selector[],
  medias: string[] = [],
  parentProperty: string|null = null,
) {
  const cssTexts: string[] = [];
  let declarations: string[] = [];
  let currentSelectors: Selector[] = [];

  for (const key in style) {
    const value = style[key];

    // Duplicate selectors
    currentSelectors = selectors.map(selector => ({
      pseudos: selector.pseudos.slice(0),
      selectors: selector.selectors.slice(0),
    }));

    const last = currentSelectors[selectors.length - 1];

    const isPseudo = isPropertyPseudo(key);
    const isMediaQuery = isPropertyMediaQuery(key);
    const isParentSelector = isPropertyParentSelector(key);

    if (isPseudo) {
      last.pseudos.push(key);

    } else if (isMediaQuery) {
      medias = medias.concat(key.slice(6).trim());

    } else if (isParentSelector) {
      last.selectors.push(key.slice(1));
    }

    if (value instanceof Object && !Array.isArray(value)) {
      // Render all previous declarations as we will now be in a new selector
      const cssText = cssTextForDeclarations(currentSelectors, medias, declarations);
      cssTexts.push(cssText);
      declarations = [];
      const currentProperty = !isPseudo && !isMediaQuery && !isParentSelector
        ? key
        : parentProperty;

      cssTextForStyle(value as Style, currentSelectors, medias, currentProperty);

    } else {
      if (!parentProperty && (isPseudo || isMediaQuery || isParentSelector)) {
        throw new Error(`No CSS property provided, just a selector ${key} for value ${JSON.stringify(value)}`);
      }

      // We can assert that if parentProperty then declarations.length === 0
      // because all siblings must be pseudo, mode or mediaquery,
      // which all reset declarations to []
      let property = key;
      if (parentProperty && (isPseudo || isParentSelector || isMediaQuery)) {
        property = parentProperty;
      }

      if (Array.isArray(value)) {
        value.forEach(val => declarations.push(generateCSSDeclaration(property, val)));
      } else {
        declarations.push(generateCSSDeclaration(property, value));
      }

      // Since the value is under a new selector, render it
      if (property === parentProperty) {
        const cssText = cssTextForDeclarations(currentSelectors, medias, declarations);
        cssTexts.push(cssText);
        declarations = [];
      }
    }
  }
  const cssText = cssTextForDeclarations(currentSelectors, medias, declarations);
  cssTexts.push(cssText);
  return cssTexts;
}

function cssTextForDeclarations(selectors: Selector[], medias: string[], declarations: string[]) {
  if (!declarations.length) return '';

  let rule = selectors
    .map(selector => (
      selector.selectors.join('') + selector.pseudos.join('')
    ))
    .reverse()
    .reduce((prev: string, selector: string) => `${selector}{${prev}}`, declarations.join(';'));

  const media = generateCombinedMediaQuery(medias);

  if (media) {
    rule = `${media}{${rule}}`;
  }

  return rule;
}

function generateCombinedMediaQuery(medias: string[]) {
  if (medias.length === 0) {
    return null;
  }
  return `@media ${medias.join(' and ')}`;
}

function isPropertyPseudo(property: string) {
  return property.charAt(0) === ':';
}

function isPropertyMediaQuery(property: string) {
  return property.substr(0, 6) === '@media';
}

function isPropertyParentSelector(property: string) {
  return property.charAt(0) === '&';
}

// const x: any = {
//   '.blah': {
//     ':hover': {
//       '&.bar': {
//         '.foo': {
//           '&.dude': {
//             x: 4,
//           }
//         }
//       }
//     }
//   }
// }

// const y = [ { selectors: ['.blah', '.bar'], pseudos: [':hover'] }, { selectors: ['.foo', '.dude'] }]
// const y = ['.blah:hover', '.foo.dude'];

// const x: any = {
//   'h1': {
//     ':hover': {
//       '&.bar': {
//         x: 4,
//       }
//     }
//   }
// }

// const x: any = {
//   'h1, h2': {
//     ':hover': {
//       '&.bar': {
//         x: 4,
//       }
//     }
//   }
// }

// const x: any = {
//   h1: {
//     ':hover': {
//       '&.bar': {
//         padding: 4,
//       }
//     }
//   },
//   h2: {
//    x: 5,
//   }
// }

// { padding: { margin: 4 } } => padding { margin: 4px }
// { h1: { padding: { '&.blah': 4 } } } => h1.blah { padding: 4px }
// { h1: { padding: { '.blah': 4 } } } => h1 { padding: { .blah: 4px } }
// { padding: 5 } => Error
// { h1: { ':hover': { padding: 4 }, ':focus': { padding: 6 }}} => h1:hover { padding: 4px} h1:focus { padding: 6px }
// { h1: { ':hover': { padding: 4 }, ':focus': { padding: 6 }}} => h1:hover { padding: 4px} h1:focus { padding: 6px }
// { h1: { '&.blah': { paddingHorizontal: 4 } } } => h1.blah { paddingLeft: 4px; paddingRight: 4px; }
// { h1: { '&.blah': { display: 'flex } } } => h1.blah { display: flex; -ms... }
