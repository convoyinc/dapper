declare module 'inline-style-prefixer/static' {
  namespace prefix {}
  function prefix(property: {[key: string]: any}): {[key: string]: any};
  export = prefix;
}
