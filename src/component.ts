import * as _ from 'lodash';
import * as React from 'react';
import * as cn from 'classnames';

import { StyleRule } from './types';
import { compileRule } from './libs/compileRule';
import { compileModes, Modes } from './libs/compileModes';
import { config as defaultConfig, Configuration } from './configure';
import validatePosition from './libs/validatePosition';
import renderCSSText from './libs/renderCSSText';

export {
  Modes,
}

export interface DapperComponentProps {
  style?: React.CSSProperties;
  className?: string;
}

export function _component(render: (cssTexts: string[], config: Configuration) => void) {
  return function component<TProps extends DapperComponentProps, TModes extends string>(
    nodeName: string | React.ComponentClass,
    displayName: string,
    styleRule: StyleRule,
    modes?: Modes<TModes>,
    configOverride: Partial<Configuration> = defaultConfig,
  ) {
    const config = { ...defaultConfig, ...configOverride } as Configuration;

    const className = compileRule(render)(styleRule, [displayName], config);

    const {
      classNames: modeClassNames,
      functionRules,
    } = modes
      ? compileModes(render)(displayName, modes, config)
      : { classNames: {}, functionRules: {} };

    return class DapperComponent extends React.Component<
      { [Mode in TModes]?: any } & TProps> {

      static displayName = displayName;

      render(): JSX.Element {
        // TODO: Test no modes
        // Gets class names to use for boolean modes
        const activeClassNames = _(modeClassNames)
          .filter((_cn, key) => !_.isNil((this.props as any)[key]))
          .join(' ');

        // Builds style object based on modes with functions
        const style: React.CSSProperties = {...this.props.style as any};
        _(functionRules)
          .omitBy((_v, modeName) => _.isNil((this.props as any)[modeName]))
          .forEach((styles: {[key: string]: Function}, mode: string) => {
            const value = (this.props as any)[mode];
            for (const key in styles) {
              style[key] = styles[key](value);
            }
          });

        const passThroughProps = _.omitBy(this.props, (_p, name) => modes && (modes as any)[name]);

        return React.createElement(nodeName as any, {
          ...passThroughProps,
          style,
          className: cn(this.props.className, className, activeClassNames),
        }, this.props.children);
      }
    };
  };
}
export const component = _component(renderCSSText);

export function _position(render: (cssTexts: string[], config: Configuration) => void) {
  return function position<TModes extends string>(
    nodeName: string | React.ComponentClass,
    displayName: string,
    styleRule: StyleRule,
    modes?: Modes<TModes>,
    configOverride: Partial<Configuration> = defaultConfig,
  ) {
    const config = { ...defaultConfig, ...configOverride } as Configuration;

    // TODO: Test with functions
    if (config.validatePosition) {
      const invalidKey = validatePosition(styleRule) ||
        _.find(modes, value => validatePosition(value));
      if (invalidKey) {
        throw new Error(`dapper.position expects only positioning-based css properties, ` +
          `instead found "${invalidKey}". Move styling overrides inside the component or ` +
          `set dapper.configure({ validatePosition: false }).`);
      }
    }
    return _component(render)(nodeName, displayName, styleRule, modes, config);
  };
}
export const position = _position(renderCSSText);

function nc<TProps>(nodeName: string) {
  return function <TModes extends string>(
    displayName: string,
    styleRule: StyleRule,
    modes?: Modes<TModes>,
  ) {
    return component<TProps, TModes>(nodeName, displayName, styleRule, modes);
  };
}

// Thanks to styled-components for this list
export const a = nc<React.HTMLAttributes<HTMLAnchorElement>>('a');
export const abbr = nc('abbr');
export const address = nc('address');
export const area = nc('area');
export const article = nc('article');
export const aside = nc('aside');
export const audio = nc('audio');
export const b = nc('b');
export const base = nc('base');
export const bdi = nc('bdi');
export const bdo = nc('bdo');
export const big = nc('big');
export const blockquote = nc('blockquote');
export const body = nc('body');
export const br = nc('br');
export const button = nc('button');
export const canvas = nc('canvas');
export const caption = nc('caption');
export const cite = nc('cite');
export const code = nc('code');
export const col = nc('col');
export const colgroup = nc('colgroup');
export const data = nc('data');
export const datalist = nc('datalist');
export const dd = nc('dd');
export const del = nc('del');
export const details = nc('details');
export const dfn = nc('dfn');
export const dialog = nc('dialog');
export const div = nc<React.HTMLAttributes<HTMLDivElement>>('div');
export const dl = nc('dl');
export const dt = nc('dt');
export const em = nc('em');
export const embed = nc('embed');
export const fieldset = nc('fieldset');
export const figcaption = nc('figcaption');
export const figure = nc('figure');
export const footer = nc('footer');
export const form = nc('form');
export const h1 = nc('h1');
export const h2 = nc('h2');
export const h3 = nc('h3');
export const h4 = nc('h4');
export const h5 = nc('h5');
export const h6 = nc('h6');
export const head = nc('head');
export const header = nc('header');
export const hgroup = nc('hgroup');
export const hr = nc('hr');
export const html = nc('html');
export const i = nc('i');
export const iframe = nc('iframe');
export const img = nc('img');
export const input = nc('input');
export const ins = nc('ins');
export const kbd = nc('kbd');
export const keygen = nc('keygen');
export const label = nc('label');
export const legend = nc('legend');
export const li = nc('li');
export const link = nc('link');
export const main = nc('main');
export const map = nc('map');
export const mark = nc('mark');
export const marquee = nc('marquee');
export const menu = nc('menu');
export const menuitem = nc('menuitem');
export const meta = nc('meta');
export const meter = nc('meter');
export const nav = nc('nav');
export const noscript = nc('noscript');
export const object = nc('object');
export const ol = nc('ol');
export const optgroup = nc('optgroup');
export const option = nc('option');
export const output = nc('output');
export const p = nc('p');
export const param = nc('param');
export const picture = nc('picture');
export const pre = nc('pre');
export const progress = nc('progress');
export const q = nc('q');
export const rp = nc('rp');
export const rt = nc('rt');
export const ruby = nc('ruby');
export const s = nc('s');
export const samp = nc('samp');
export const script = nc('script');
export const section = nc('section');
export const select = nc('select');
export const small = nc('small');
export const source = nc('source');
export const span = nc('span');
export const strong = nc('strong');
export const style = nc('style');
export const sub = nc('sub');
export const summary = nc('summary');
export const sup = nc('sup');
export const table = nc('table');
export const tbody = nc('tbody');
export const td = nc('td');
export const textarea = nc('textarea');
export const tfoot = nc('tfoot');
export const th = nc('th');
export const thead = nc('thead');
export const time = nc('time');
export const title = nc('title');
export const tr = nc('tr');
export const track = nc('track');
export const u = nc('u');
export const ul = nc('ul');
export const video = nc('video');
export const wbr = nc('wbr');
export const circle = nc('circle');
export const clipPath = nc('clipPath');
export const defs = nc('defs');
export const ellipse = nc('ellipse');
export const g = nc('g');
export const image = nc('image');
export const line = nc('line');
export const linearGradient = nc('linearGradient');
export const mask = nc('mask');
export const path = nc('path');
export const pattern = nc('pattern');
export const polygon = nc('polygon');
export const polyline = nc('polyline');
export const radialGradient = nc('radialGradient');
export const rect = nc('rect');
export const stop = nc('stop');
export const svg = nc('svg');
export const text = nc('text');
export const tspan = nc('tspan');
