import * as _ from 'lodash';

export type CompiledStyleSheet<Keys extends string> = {
  [Key in Keys]: CompiledStyle;
};

export type CompiledStyle = string;

export interface StyledComponent<Keys extends string> extends React.Component<any, any> {
  styles: CompiledStyleSheet<Keys>;
}

export type ModeResolver<P, S> = {[key: string]: (props: P, state: S) => boolean};

/**
 * Better style management for our components.
 *
 */
export default function dapper<Styles extends Object, Props, State>(
  styles: Styles,
  modeResolver: ModeResolver<Props, State>,
) {
  // const processedStyles = _.mapValues(styles, _compileStyleConfig);

  // /**
  //  * Compiles a single style config (an object containing styles, and potentially
  //  * nested styles grouped by conditions).
  //  */
  // function _compileStyleConfig(config:Object) {
  //   const rawStyles:Object = {};
  //   _.each(config, (value, key:string) => {
  //     rawStyles[key] = value;
  //   });

  //   return {
  //     styles: rawStyles,
  //   };
  // }

  /**
   * Injects compiled styles into a class based (stateful) component.
   */
  function _decorateClassicalComponent(constructor:React.ComponentClass<any>, compiledStyles:Styles) {
    if (_.startsWith(constructor.displayName, 'Connect(')) {
      throw new TypeError(`@dapper must come AFTER @connect (see ${constructor.displayName})`);
    }

    _hookMethod(constructor, 'render', (instance:StyledComponent<keyof Styles>, origRender:Function, ...args:any[]) => {
      instance.styles = _.mapValues<Styles, CompiledStyleSheet<keyof Styles>>(compiledStyles, _evaluateCompiledStyles.bind(null, instance));

      return origRender(...args);
    });
  }

  /**
   * Expands compiled styles based on the state of the instance.
   */
  function _evaluateCompiledStyles(instance:React.Component<any, any>, _compiledConfig:Object):string {
    // let styles = [compiledConfig];
    // _.each(compiledConfig.conditionalStyles, conditionalStyle => {
    //   if (conditionalStyle.condition(instance)) {
    //     styles = [...styles, ..._evaluateCompiledStyles(instance, conditionalStyle.config)];
    //   }
    // });

    modeResolver['blah'](instance.props, instance.state);

    return 'a';
  }

  /**
   * Replaces a method on a class' prototype, allowing the caller to wrap it.
   */
  function _hookMethod(klass:Function, name:string, newMethod:Function) {
    const origMethod = klass.prototype[name] || _.noop;
    klass.prototype[name] = function hookedMethod(...args:any[]) {
      return newMethod.call(this, this, origMethod.bind(this), ...args);
    };
  }

  return function dapperDecorator(constructor:React.ComponentClass<any>) {
    if (!_.isFunction(constructor.prototype.render)) {
      throw new Error(`Stateless components aren't supported by @dapper`);
    }
    return _decorateClassicalComponent(constructor, styles);
  };
}
