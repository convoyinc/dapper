import compute from './compute';
import configure, { Configuration } from './configure';
import create, { createSimple } from './create';
import keyframes from './keyframes';
import renderStatic from './renderStatic';
import { Style } from './types';

export { Style, Configuration };
export default {
  compute,
  configure,
  create,
  createSimple,
  keyframes,
  renderStatic,
};
