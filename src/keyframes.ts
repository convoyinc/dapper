import { config as defaultConfig, Configuration } from './configure';
import { StyleRule } from './types';
import renderCSSText from './libs/renderCSSText';
import generateCSSDeclaration from './libs/generateCSSDeclaration';
import applyPlugins from './plugins';

let uniqueKeyframeIdentifier = 0;

export type KeyFrames = {[key: string]: StyleRule};

export function keyframes(render: (cssTexts: string[], config: Configuration) => void) {
  return function keyframes(
    keyframe: KeyFrames,
    configOverride: Partial<Configuration> = defaultConfig,
  ) {
    const config = { ...defaultConfig, ...configOverride } as Configuration;
    const animationName = generateAnimationName(++uniqueKeyframeIdentifier, config);

    const cssText = cssifyKeyframe(keyframe, animationName);

    render([cssText], config);

    return animationName;
  };
}
export default keyframes(renderCSSText);

function cssifyKeyframe(frames: KeyFrames, animationName: string) {
  const keyframe = Object
    .keys(frames)
    .reduce((css, percentage) => `${css + percentage}{${cssifyObject(frames[percentage])}}`, '');

  return `@keyframes ${animationName}{${keyframe}}`;
}

function generateAnimationName(id: number, config: Configuration) {
  return `${config.classNamePrefix}anim-${id}`;
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
