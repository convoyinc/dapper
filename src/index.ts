import reactTo from './reactTo';
import compute from './compute';
import configure, { Configuration } from './configure';
import create, { createSimple } from './create';
import keyframes from './keyframes';
import renderStatic from './renderStatic';
import { StyleRule } from './types';

export {
  Configuration,
  StyleRule,
  create as compile, // https://github.com/convoyinc/dapper/issues/13
  reactTo,
};
export default {
  compute,
  configure,
  create,
  createSimple,
  keyframes,
  renderStatic,
};
