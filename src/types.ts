// Inputs

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
export type StyleDeclaration<TKeys extends string> = { [TKey in TKeys]: StyleRule };

/**
 * A map of predicate functions that declare the modes that should be made
 * available to a dynamic stylesheet.
 *
 * Each predicate returns whether a given mode (identified by `key`) should be
 * enabled given `state`.
 */
export type ModeDeclarations<TState> = {[key: string]: (state: TState) => boolean};

// Intermediates

/**
 * Evaluates which CSS classes should be enabled given the set of active modes.
 */
export type StyleReducer = (modes: ActiveModes) => CSSClassName;

/**
 * A compiled style rule; may either be a static class name expression, or one
 * that requires dynamic computation based on active modes.
 */
export type CompiledStyle = CSSClassName | StyleReducer;

/**
 * A map of rule names to their compiled rules.
 */
export type CompiledStyleSheet<TKeys extends string> = {
  [Key in TKeys]: CompiledStyle;
};

/**
 * A set of modes that are considered active, represented as an object so that
 * consumers don't have to polyfill Set.
 */
export type ActiveModes = {[key: string]: boolean};

// Outputs

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
