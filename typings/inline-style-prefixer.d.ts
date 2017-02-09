declare module 'inline-style-prefixer/static' {
  type Styles = {[key: string]: string | string[] | Object};
  namespace prefix {}
  function prefix(property:Styles):{[key: string]:Styles};
  export = prefix;
}
