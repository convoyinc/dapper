export type CompiledSimpleStyleSheet<TKeys extends string> = {
  [Key in TKeys]: string;
};

export type CompiledStyleSheet<TKeys extends string> = {
  [Key in TKeys]: CompiledStyle;
};

export type CompiledStyle = string | StyleReducer;

/**
 * A predicate function that returns whether a given mode (identified by `key`)
 * should be enabled given `state`.
 */
export type ModeResolver<TState> = {[key: string]: (state: TState) => boolean};

/**
 * A set of modes that are considered active, represented as an object so that
 * consumers don't have to polyfill Set.
 */
export type ActiveModes = {[key: string]: boolean};

/**
 * Evaluates which CSS classes should be enabled given the set of active modes.
 */
export type StyleReducer = (modes: ActiveModes) => CSSClassName;

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
 * A CSS class name express that is associated with a computed style rule.  May
 * be a combination of multiple CSS class names.
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
