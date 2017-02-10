export default function renderStatic(style: Style) {
  for (const property in style) {
    const value = style[property];

      const staticReference = generateStaticReference(staticStyle, selector)

      if (!renderer.cache[staticReference]) {
        const cssDeclarations = cssifyStaticStyle(staticStyle, renderer.plugins)
        renderer.cache[staticReference] = true

        if (typeof staticStyle === 'string') {
          renderer.statics += cssDeclarations
          renderer._emitChange({
            type: STATIC_TYPE,
            css: cssDeclarations
          })
        } else {
          renderer.statics += generateCSSRule(selector, cssDeclarations)
          renderer._emitChange({
            selector,
            declaration: cssDeclarations,
            type: RULE_TYPE,
            media: ''
          })
        }
      }
    },
}
