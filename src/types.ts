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
 * A collection of style rules represented by JavaScript Objects, which are
 * eventually flattened, and compiled down into actual CSS rules.
 */
export type StyleDeclaration = {[key: string]: StyleRule};

/**
 * An individual style rule, containing CSS property declarations (with JS-style
 * property names), as well as other nested rules.
 */
export type StyleRule = {[key: string]: number|string|string[]|StyleRule};

export type ComputedStyleSheet<Keys extends string> = {
  [Key in Keys]: ComputedStyle;
};

export type ComputedStyle = string;
