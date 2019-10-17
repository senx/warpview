/*
 * Copyright 2019 SenX S.A.S.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class ColorLib {
  static color = {
    VIRIDIS: [
      '#440154',
      '#481f70',
      '#443983',
      '#3b528b',
      '#31688e',
      '#287c8e',
      '#21918c',
      '#20a486',
      '#35b779',
      '#5ec962',
      '#90d743',
      '#c8e020',
    ],

    MAGMA: [
      '#000004',
      '#100b2d',
      '#2c115f',
      '#51127c',
      '#721f81',
      '#932b80',
      '#b73779',
      '#d8456c',
      '#f1605d',
      '#fc8961',
      '#feb078',
      '#fed799',
    ],

    INFERNO: [
      '#000004',
      '#110a30',
      '#320a5e',
      '#57106e',
      '#781c6d',
      '#9a2865',
      '#bc3754',
      '#d84c3e',
      '#ed6925',
      '#f98e09',
      '#fbb61a',
      '#f4df53',
    ],

    PLASMA: [
      '#0d0887',
      '#3a049a',
      '#5c01a6',
      '#7e03a8',
      '#9c179e',
      '#b52f8c',
      '#cc4778',
      '#de5f65',
      '#ed7953',
      '#f89540',
      '#fdb42f',
      '#fbd524',
    ],
    YL_OR_RD: [
      '#ffffcc',
      '#ffeda0',
      '#fed976',
      '#feb24c',
      '#fd8d3c',
      '#fc4e2a',
      '#e31a1c',
      '#bd0026',
      '#800026',
    ],
    YL_GN_BU: [
      '#ffffd9',
      '#edf8b1',
      '#c7e9b4',
      '#7fcdbb',
      '#41b6c4',
      '#1d91c0',
      '#225ea8',
      '#253494',
      '#081d58',
    ],
    BU_GN: [
      '#f7fcfd',
      '#ebf7fa',
      '#dcf2f2',
      '#c8eae4',
      '#aadfd2',
      '#88d1bc',
      '#68c2a3',
      '#4eb485',
      '#37a266',
      '#228c49',
      '#0d7635',
      '#025f27',
    ],
    WARP10: [
      '#ff9900',
      '#004eff',
      '#E53935',
      '#7CB342',
      '#F4511E',
      '#039BE5',
      '#D81B60',
      '#C0CA33',
      '#6D4C41',
      '#8E24AA',
      '#00ACC1',
      '#FDD835',
      '#5E35B1',
      '#00897B',
      '#FFB300',
      '#3949AB',
      '#43A047',
      '#1E88E5',
    ],
    NINETEEN_EIGHTY_FOUR: ['#31C0F6', '#A500A5', '#FF7E27'],
    ATLANTIS: ['#74D495', '#3F3FBA', '#FF4D9E'],
    DO_ANDROIDS_DREAM: ['#8F8AF4', '#A51414', '#F4CF31'],
    DELOREAN: ['#FD7A5D', '#5F1CF2', '#4CE09A'],
    CTHULHU: ['#FDC44F', '#007C76', '#8983FF'],
    ECTOPLASM: ['#DA6FF1', '#00717A', '#ACFF76'],
    T_MAX_400_FILM: ['#F6F6F8', '#A4A8B6', '#545667']
  };

// Chronograf Colors


  /**
   * Get a color from index
   *
   * @param {number} i
   * @param {string} scheme
   * @returns {string}
   */
  static getColor(i: number, scheme: string) {
    console.log(scheme);
    return ColorLib.color[scheme][i % ColorLib.color[scheme].length];
  }

  static getColorScale(i, scheme: string) {
    // return 'linear-gradient(#e66465, ' + ColorLib.transparentize(ColorLib.getColor(i)) + ');';
    return [[0.0, '#00000000'], [1.0, ColorLib.transparentize(ColorLib.getColor(i, scheme))]];
  }

  /**
   * Convert hex to RGB
   * @param hex
   * @returns {number[]}
   */
  static hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  }

  /**
   * Add an alpha channel
   *
   * @param color
   * @param {number} alpha
   * @returns {string}
   */
  static transparentize(color, alpha = 0.7): string {
    return 'rgba(' + ColorLib.hexToRgb(color).concat(alpha).join(',') + ')';
  }

  /**
   *
   * @param num
   * @param scheme
   * @returns {[]}
   */
  static generateColors(num, scheme) {
    let color = [];
    for (let i = 0; i < num; i++) {
      color.push(ColorLib.getColor(i, scheme));
    }
    return color;
  }

  /**
   *
   * @param num
   * @param scheme
   * @returns {[]}
   */
  static generateTransparentColors(num, scheme) {
    let color = [];
    for (let i = 0; i < num; i++) {
      color.push(ColorLib.transparentize(ColorLib.getColor(i, scheme)));
    }
    return color;
  }

  static hsvGradientFromRgbColors(c1, c2, steps) {
    let c1hsv = ColorLib.rgb2hsv(c1.r, c1.g, c1.b);
    let c2hsv = ColorLib.rgb2hsv(c2.r, c2.g, c2.b);

    c1.h = c1hsv[0];
    c1.s = c1hsv[1];
    c1.v = c1hsv[2];
    c2.h = c2hsv[0];
    c2.s = c2hsv[1];
    c2.v = c2hsv[2];

    let gradient = ColorLib.hsvGradient(c1, c2, steps);
    for (let i in gradient) {
      if (gradient[i]) {
        gradient[i].rgb = ColorLib.hsv2rgb(gradient[i].h, gradient[i].s, gradient[i].v);
        gradient[i].r = Math.floor(gradient[i].rgb[0]);
        gradient[i].g = Math.floor(gradient[i].rgb[1]);
        gradient[i].b = Math.floor(gradient[i].rgb[2]);
      }
    }
    return gradient;
  }

  private static rgb2hsv(r: number, g: number, b: number) {
    // Normalize
    let normR = r / 255.0;
    let normG = g / 255.0;
    let normB = b / 255.0;


    let M = Math.max(normR, normG, normB);
    let m = Math.min(normR, normG, normB);
    let d = M - m;

    let h;
    let s;
    let v;

    v = M;
    if (d === 0) {
      h = 0;
      s = 0;
    } else {
      s = d / v;
      switch (M) {
        case normR:
          h = ((normG - normB) + d * (normG < normB ? 6 : 0)) / 6 * d;
          break;
        case normG:
          h = ((normB - normR) + d * 2) / 6 * d;
          break;
        case normB:
          h = ((normR - normG) + d * 4) / 6 * d;
          break;
      }
    }
    return [h, s, v];
  }

  private static hsvGradient(c1: any, c2: any, steps: any) {
    let gradient = new Array(steps);

    // determine clockwise and counter-clockwise distance between hues
    let distCCW = (c1.h >= c2.h) ? c1.h - c2.h : 1 + c1.h - c2.h;
    let distCW = (c1.h >= c2.h) ? 1 + c2.h - c1.h : c2.h - c1.h;

    // make gradient for this part
    for (let i = 0; i < steps; i++) {
      // interpolate h, s, b
      let h = (distCW <= distCCW) ? c1.h + (distCW * i / (steps - 1)) : c1.h - (distCCW * i / (steps - 1));
      if (h < 0) {
        h = 1 + h;
      }
      if (h > 1) {
        h = h - 1;
      }
      let s = (1 - i / (steps - 1)) * c1.s + i / (steps - 1) * c2.s;
      let v = (1 - i / (steps - 1)) * c1.v + i / (steps - 1) * c2.v;
      // add to gradient array
      gradient[i] = {h: h, s: s, v: v};
    }
    return gradient;
  }

  private static hsv2rgb(h: any, s: any, v: any) {
    let r;
    let g;
    let b;

    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }

    return [r * 255, g * 255, b * 255];
  }

  static rgb2hex(r, g, b) {
    function componentToHex(c) {
      let hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }

    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
}
