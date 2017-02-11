import { config } from './configure';
import { Style } from './types';
import renderCSSText from './libs/renderCSSText';
import cssifyObject from './libs/cssifyObject';

let uniqueKeyframeIdentifier = 0;

export type KeyFrames = {[key: string]: Style};

export default function keyframes(keyframe: KeyFrames) {

  const animationName = generateAnimationName(++uniqueKeyframeIdentifier);

  const cssText = cssifyKeyframe(keyframe, animationName);

  renderCSSText(cssText);

  return animationName;
}

function cssifyKeyframe(frames: KeyFrames, animationName: string) {
  const keyframe = Object
    .keys(frames)
    .reduce((css, percentage) => `${css + percentage}{${cssifyObject(frames[percentage])}}`, '');

  return config.keyframePrefixes.reduce((css, prefix) => `${css}@${prefix}keyframes ${animationName}{${keyframe}}`, '');
}

function generateAnimationName(id: number) {
  return `${config.classNamePrefix}anim_${id}`;
}
