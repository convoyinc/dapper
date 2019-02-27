import { config as defaultConfig, Configuration } from './configure';
import { StyleRule } from './types';
import renderCSSText from './libs/renderCSSText';
import generateCSSDeclaration from './libs/generateCSSDeclaration';
import applyPlugins from './plugins';
import createStableSuffix from './createStableSuffix';

let uniqueKeyframeIdentifier = 0;

export type KeyFrames = {[key: string]: StyleRule};

export default function keyframes(
  keyframe: KeyFrames,
  configOverride: Partial<Configuration> = defaultConfig,
) {
  const config = { ...defaultConfig, ...configOverride } as Configuration;
  const animationName = generateAnimationName(keyframe, config);

  const cssText = cssifyKeyframe(keyframe, animationName);

  renderCSSText([cssText], config);

  return animationName;
}

function cssifyKeyframe(frames: KeyFrames, animationName: string) {
  const keyframe = Object
    .keys(frames)
    .reduce((css, percentage) => `${css + percentage}{${cssifyObject(frames[percentage])}}`, '');

  return `@keyframes ${animationName}{${keyframe}}`;
}

function generateAnimationName(keyframe: KeyFrames, config: Configuration) {
  const suffix = config.stableSuffices
    ? createStableSuffix({ keyframe }, config)
    : ++uniqueKeyframeIdentifier;
  return `${config.classNamePrefix}anim-${suffix}`;
}

function cssifyObject(style: StyleRule) {
  style = applyPlugins(style);

  const declarations: string[] = [];

  for (const property in style) {
    const value = style[property];
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new Error(`The invalid value \`${value}\` has been used as \`${property}\`.`);
    }

    if (Array.isArray(value)) {
      value.map(val => declarations.push(generateCSSDeclaration(property, val)));
    } else {
      declarations.push(generateCSSDeclaration(property, value));
    }
  }

  return declarations.join(';');
}

export function resetUniqueId() {
  uniqueKeyframeIdentifier = 0;
}
