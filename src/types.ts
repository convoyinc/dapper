export type CompiledSimpleStyleSheet<Keys extends string> = {
  [Key in Keys]: string;
};

export type CompiledStyleSheet<Keys extends string> = {
  [Key in Keys]: CompiledStyle;
};

export type CompiledStyle = string | StyleReducer;

export type ModeResolver<S> = {[key: string]: (state: S) => boolean};

export type ClassNameResolver = {[key: string]: boolean};

export type StyleReducer = (modes: ClassNameResolver) => string;

/**
 * Either a CSS value (as a string), or a numeric value that will be coerced
 * into a context-appropriate value.
 *
 * Typically, this means we append a CSS unit of 'px' to the number.  Some
 * properties (such as `lineHeight`) can be unitless, and will not gain a unit.
 */
export type StyleValue = number|string;

/**
 * An individual style rule, containing CSS property declarations (with JS-style
 * property names), as well as other nested rules.
 */
export type StyleRule = {[key: string]: StyleValue|StyleValue[]|StyleRule};

/**
 * A collection of style rules represented by JavaScript Objects, which are
 * eventually flattened, and compiled down into actual CSS rules.
 */
export type StyleDeclaration = {[key: string]: StyleRule};

/**
 * A CSS class name that is associated with a computed style rule.
 */
export type CSSClassName = string;

/**
 * A map of rule names to the CSS class name that represents them.
 *
 * This is the result of computing a compiled style declaration.
 */
export type ComputedStyleSheet<Keys extends string> = {
  [Key in Keys]: CSSClassName;
};
