import {
  StyleDeclaration,
} from './types';

/**
 *
 * @deprecated In favor of using a plain Object passed to reactTo or compute
 */
export default function compile<TKeys extends string>(
  styles: StyleDeclaration<TKeys>,
): StyleDeclaration<TKeys> {
  return styles;
}
