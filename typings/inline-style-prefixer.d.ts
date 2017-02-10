declare module 'inline-style-prefixer/static' {
  type Styles = {[key: string]: number | string | string[] | Styles};
  namespace prefix {}
  function prefix(property:Styles):Styles;
  export = prefix;
}
