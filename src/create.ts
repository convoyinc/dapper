import * as _ from 'lodash';
import hyphenateStyleName from 'hyphenate-style-name';

export type CompiledStyleSheet<Keys extends string> = {
  [Key in Keys]: CompiledStyle;
};

export type CompiledStyle = string | StyleReducer;

export type ModeResolver = {[key: string]: boolean};

export type StyleReducer = (modes: ModeResolver) => string;

export type Style = {[key: string]: string|Object};

let uniqueRuleIdentifier = 0;


export default function create<Styles extends Object>(
  styles: Styles,
): CompiledStyleSheet<keyof Styles> {
  return _.mapValues(styles, style => renderStyleToReducer(style)) as any;
}


const [base, others] = _.partition(style, modesOrMediaOrSelector);
if (base has keys) {
  generate(className, base);
}

getCompiledStyle('abc', { isCool: 'def' });

const styles: Object = {
  x: { // .abc
    color: 'red',
    ':hover': { // .abc:hover
      color: 'blue',
      $isCool: { // .abc.def:hover
        width: 10,
      },
    },
    $isCool: { // .abc.def
      background: 'blue',
      '@media (min-width: 300px)': { // @media ... { .abc.def }
        background: 'red',
      },
      $blah: { // .abc.def.fgh
        background: 'black',
        '@media (min-width: 300px)': { // @media ... { .abc.def }
          $hovered: { // @media ... { abc.def.ghi }

          }
        },
      },
    },
    $blah: { // .fgh
      background: 'green',
    },
  },
  y: { // .ijk
    $isCool: { // .ijk.def

    }
  }
};

function renderStyleToReducer(style: Style, pseudo = '', media = '') {
  const className = generateClassName(++uniqueRuleIdentifier);
  const classNamesForModes: {[key: string]: string} = {};

  const declarations = [];
  for (const property in style) {
    const value = style[property];
    if (value instanceof Object) {
      if (isPseudo(property)) {
        doBlah(className, pseudo + property, media);


      } else if (isMediaQuery(property)) {
        property.slice(6).trim();
        doBlah()

      } else if (isMode(property)) {
        doBlah()

      } else {
        throw new Error(`Invalid style for property ${property}`);
      }
    } else {
      const cssDeclaration = generateCSSDeclaration(property, value);
      declarations.push(cssDeclaration);
    }
  }
  // TODO: Insert rule into stylesheet
  // const selector = generateCSSSelector(className, pseudo);
  // const cssRule = generateCSSRule(selector, declarations.join(';'));

  return getCompiledStyle(className, classNamesForModes);
}

function isPseudo(property: string) {
  return property.charAt(0) === ':';
}

function isMediaQuery(property: string) {
  return property.substr(0, 6) === '@media';
}

function isMode(property: string) {
  return property.charAt(0) === '$';
}

function getCompiledStyle(className: string, classNamesForModes: {[key: string]: string}) {
  if (!Object.keys(classNamesForModes).length) {
    return className;
  } else {
    return function styleReducer(modes: ModeResolver) {
      const classNames = [className];
      for (const mode in modes) {
        if (modes[mode]) {
          classNames.push(classNamesForModes[mode]);
        }
      }
      return classNames.join(' ');
    };
  }
}

const CHARS = 'abcdefghijklmnopqrstuvwxyz';
const CHAR_LENGTH = CHARS.length;

function generateClassName(id: number, className = '') {
  if (id <= CHAR_LENGTH) {
    return CHARS[id - 1] + className;
  }

  // Bitwise floor as safari performs much faster https://jsperf.com/math-floor-vs-math-round-vs-parseint/55
  return generateClassName(id / CHAR_LENGTH | 0, CHARS[id % CHAR_LENGTH] + className);
}

export default function generateCSSDeclaration(property: string, value: string|number) {
  return `${hyphenateStyleName(property)}:${value}`;
}

export default function getCSSSelector(className: string, pseudo = '') {
  return `.${className}${pseudo}`;
}

export default function generateCSSRule(selector: string, cssDeclaration: string) {
  return `${selector}{${cssDeclaration}}`;
}

export default function generateCombinedMediaQuery(currentMediaQuery: string, nestedMediaQuery: string) {
  if (currentMediaQuery.length === 0) {
    return nestedMediaQuery;
  }
  return `${currentMediaQuery} and ${nestedMediaQuery}`;
}
