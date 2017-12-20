import { StyleDeclaration, ComputedStyleSheet, ModeDeclarations } from './types';
import compute from './compute';

/**
 * Computes styles for a react component, and ensures that they are kept up to
 * date as the component changes.
 *
 * In essence, this hooks the component's `componentWillUpdate`, and updates
 * the returned styles appropriately.
 */
export default function reactTo<TProps, TState, TRules extends string>(
  component: React.Component<TProps, TState>,
  styles: StyleDeclaration<TRules>,
  modes?: ModeDeclarations<{ props: TProps, state: TState }>,
): ComputedStyleSheet<TRules> {
  // We keep a reference to a single computed styles object; and are careful to
  // only ever update its properties, rather than make assumptions about what
  // it is named.
  const computed = compute(styles, modes, component);

  // Note that we will hook a component each time `reactTo` is called on it,
  // even if it's been hooked in the past.  This allows us to support multiple
  // style objects per component; and avoids requring knowledge about which
  // property needs updating (and how to reach it).
  _hook(component, 'componentWillUpdate', (base, props: TProps, state: TState, ...args: any[]) => {
    Object.assign(computed, compute(styles, modes, { props, state }));
    if (base) base(props, state, ...args);
  });

  return computed;
}

type HookedBehavior = (base: Function | undefined, ...args: any[]) => void;

function _hook(target: any, name: string, behavior: HookedBehavior): void {
  const existing = target[name];
  if (existing && typeof existing !== 'function') {
    throw new Error(`reactTo() is unsure how to handle a component with a ${typeof existing} ${name}`);
  }

  target[name] = function hookedForDapper(...args: any[]) {
    behavior.call(this, existing, ...args);
  }; ;
}
