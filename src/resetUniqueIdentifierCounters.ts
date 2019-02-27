import * as keyframes from './keyframes';
import * as generateClassName from './libs/generateClassName';

export default function resetUniqueIdentifierCounters() {
  keyframes.resetUniqueId();
  generateClassName.resetUniqueId();
};
