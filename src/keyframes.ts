import { config } from './configure';
import generateCSSDeclaration from './generateCSSDeclaration';
import { Style } from './types';
import renderCSSText from './renderCSSText';

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

function cssifyObject(style: Style) {
  const declarations: string[] = [];

  for (const property in style) {
    const value = style[property];
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new Error(`The invalid value \`${value}\` has been used as \`${property}\`.`);
    }

    declarations.push(generateCSSDeclaration(property, value));
  }

  return declarations.join(';');
}
