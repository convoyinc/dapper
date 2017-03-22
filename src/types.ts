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

export type StyleRule = {[key: string]: number|string|string[]|StyleRule};

export type StyleDeclaration = {[key: string]: StyleRule};

export type ComputedStyleSheet<Keys extends string> = {
  [Key in Keys]: ComputedStyle;
};

export type ComputedStyle = string;
