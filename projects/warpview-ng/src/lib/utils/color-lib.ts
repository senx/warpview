/*
 *  Copyright 2021  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
export enum Colors {
  COHESIVE = 'COHESIVE',
  COHESIVE_2 = 'COHESIVE_2',
  BELIZE = 'BELIZE',
  VIRIDIS = 'VIRIDIS',
  MAGMA = 'MAGMA',
  INFERNO = 'INFERNO',
  PLASMA = 'PLASMA',
  YL_OR_RD = 'YL_OR_RD',
  YL_GN_BU = 'YL_GN_BU',
  BU_GN = 'BU_GN',
  WARP10 = 'WARP10',
  NINETEEN_EIGHTY_FOUR = 'NINETEEN_EIGHTY_FOUR',
  ATLANTIS = 'ATLANTIS',
  DO_ANDROIDS_DREAM = 'DO_ANDROIDS_DREAM',
  DELOREAN = 'DELOREAN',
  CTHULHU = 'CTHULHU',
  ECTOPLASM = 'ECTOPLASM',
  T_MAX_400_FILM = 'T_MAX_400_FILM',
}

export class ColorLib {
  static color = {
    COHESIVE: ['#F2D354', '#E4612F', '#D32C2E', '#6D2627', '#6C7F55', '#934FC6', '#F07A5D', '#ED8371', '#94E751',
      '#C457F7', '#973AF7', '#B6FF7A', '#C7FFD5', '#90E4D0', '#E09234', '#D2FF91', '#17B201'],
    COHESIVE_2: ['#6F694E', '#65D0B2', '#D8F546', '#FF724B', '#D6523E', '#F9F470', '#F4BC78', '#B1D637', '#FFCFC8',
      '#56CDAB', '#CFDD22', '#B3F5D2', '#97DB29', '#9DC5EE', '#CFC0F5', '#EDEA29', '#5EC027', '#386C94'],
    BELIZE: ['#5899DA', '#E8743B', '#19A979', '#ED4A7B', '#945ECF', '#13A4B4', '#525DF4', '#BF399E', '#6C8893',
      '#EE6868', '#2F6497'],
    VIRIDIS: ['#440154', '#481f70', '#443983', '#3b528b', '#31688e', '#287c8e', '#21918c', '#20a486', '#35b779',
      '#5ec962', '#90d743', '#c8e020'],
    MAGMA: ['#000004', '#100b2d', '#2c115f', '#51127c', '#721f81', '#932b80', '#b73779', '#d8456c', '#f1605d',
      '#fc8961', '#feb078', '#fed799'],
    INFERNO: ['#000004', '#110a30', '#320a5e', '#57106e', '#781c6d', '#9a2865', '#bc3754', '#d84c3e', '#ed6925',
      '#f98e09', '#fbb61a', '#f4df53'],
    PLASMA: ['#0d0887', '#3a049a', '#5c01a6', '#7e03a8', '#9c179e', '#b52f8c', '#cc4778', '#de5f65', '#ed7953',
      '#f89540', '#fdb42f', '#fbd524'],
    YL_OR_RD: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
    YL_GN_BU: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
    BU_GN: ['#f7fcfd', '#ebf7fa', '#dcf2f2', '#c8eae4', '#aadfd2', '#88d1bc', '#68c2a3', '#4eb485', '#37a266',
      '#228c49', '#0d7635', '#025f27'],
    WARP10: [
      '#ff9900', '#E53935', '#F4511E', '#D81B60',
      '#00ACC1', '#1E88E5', '#43A047', '#FFB300',
      '#6D4C41', '#FDD835', '#00897B', '#3949AB',
      '#5E35B1', '#8E24AA', '#C0CA33', '#039BE5',
      '#7CB342', '#004eff'],
    NINETEEN_EIGHTY_FOUR: ['#fc9ca2', '#fb747d', '#fa4c58', '#f92432', '#e30613', '#c70512', '#9f040e', '#77030b', '#500207'],
    ATLANTIS: ['#edf2fb', '#e2eafc', '#d7e3fc', '#ccdbfd', '#c1d3fe', '#b6ccfe', '#abc4ff'],
    DO_ANDROIDS_DREAM: ['#d8f3dc', '#b7e4c7', '#95d5b2', '#74c69d', '#52b788', '#40916c', '#2d6a4f', '#1b4332',
      '#081c15'],
    DELOREAN: ['#b98b73', '#cb997e', '#ddbea9', '#ffe8d6', '#d4c7b0', '#b7b7a4', '#a5a58d', '#6b705c', '#3f4238'],
    CTHULHU: ['#004c6d', '#006083', '#007599', '#008bad', '#00a1c1', '#00b8d3', '#00cfe3', '#00e7f2', '#00ffff'],
    ECTOPLASM: ['#006466', '#065a60', '#0b525b', '#144552', '#1b3a4b', '#212f45', '#272640', '#312244', '#3e1f47', '#4d194d'],
    T_MAX_400_FILM: ['#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd', '#6c757d', '#495057', '#343a40', '#212529'],
    MATRIX: ['#025f27', '#025f27', '#0d7635', '#228c49', '#37a266', '#4eb485', '#68c2a3', '#88d1bc'],
    CHARTANA: ['#77BE69', '#FADE2B', '#F24865', '#5694F2',
      '#FF9830', '#B876D9'],
  };

  static getColor(i: number, scheme: string) {
    if (!ColorLib.color[scheme]) {
      scheme = 'WARP10';
    }
    return ColorLib.color[scheme][i % 2 === 0
      ? i % ColorLib.color[scheme].length
      : ColorLib.color[scheme].length - i % ColorLib.color[scheme].length
      ];
  }

  static getColorGradient(id: number, scheme: string) {
    return [
      [0, ColorLib.transparentize(ColorLib.getColor(id, scheme), 0)],
      [1, ColorLib.transparentize(ColorLib.getColor(id, scheme), 0.7)]
    ];
  }

  static getBlendedColorGradient(id: number, scheme: string, bg = '#000000') {
    return [
      [0, ColorLib.blend_colors(bg, ColorLib.getColor(id, scheme), 0)],
      [1, ColorLib.blend_colors(bg, ColorLib.getColor(id, scheme), 1)]
    ];
  }

  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  }

  static transparentize(color, alpha = 0.5): string {
    return 'rgba(' + ColorLib.hexToRgb(color).concat(alpha).join(',') + ')';
  }

  static generateTransparentColors(num, scheme) {
    const color = [];
    for (let i = 0; i < num; i++) {
      color.push(ColorLib.transparentize(ColorLib.getColor(i, scheme)));
    }
    return color;
  }

  static hsvGradientFromRgbColors(c1, c2, steps) {
    const c1hsv = ColorLib.rgb2hsv(c1.r, c1.g, c1.b);
    const c2hsv = ColorLib.rgb2hsv(c2.r, c2.g, c2.b);
    c1.h = c1hsv[0];
    c1.s = c1hsv[1];
    c1.v = c1hsv[2];
    c2.h = c2hsv[0];
    c2.s = c2hsv[1];
    c2.v = c2hsv[2];
    const gradient = ColorLib.hsvGradient(c1, c2, steps);
    for (const i in gradient) {
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
    const normR = r / 255.0;
    const normG = g / 255.0;
    const normB = b / 255.0;
    const M = Math.max(normR, normG, normB);
    const m = Math.min(normR, normG, normB);
    const d = M - m;
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
    const gradient = new Array(steps);
    // determine clockwise and counter-clockwise distance between hues
    const distCCW = (c1.h >= c2.h) ? c1.h - c2.h : 1 + c1.h - c2.h;
    const distCW = (c1.h >= c2.h) ? 1 + c2.h - c1.h : c2.h - c1.h;
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
      const s = (1 - i / (steps - 1)) * c1.s + i / (steps - 1) * c2.s;
      const v = (1 - i / (steps - 1)) * c1.v + i / (steps - 1) * c2.v;
      // add to gradient array
      gradient[i] = {h, s, v};
    }
    return gradient;
  }

  private static hsv2rgb(h: any, s: any, v: any) {
    let r;
    let g;
    let b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
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
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }

    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  static blend_colors(color1, color2, percentage) {
    // check input
    color1 = color1 || '#000000';
    color2 = color2 || '#ffffff';
    percentage = percentage || 0.5;
    // 1: validate input, make sure we have provided a valid hex
    if (color1.length !== 4 && color1.length !== 7) {
      throw new Error('colors must be provided as hexes');
    }
    if (color2.length !== 4 && color2.length !== 7) {
      throw new Error('colors must be provided as hexes');
    }
    if (percentage > 1 || percentage < 0) {
      throw new Error('percentage must be between 0 and 1');
    }
    // 2: check to see if we need to convert 3 char hex to 6 char hex, else slice off hash
    //      the three character hex is just a representation of the 6 hex where each character is repeated
    //      ie: #060 => #006600 (green)
    if (color1.length === 4) {
      color1 = color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
    } else {
      color1 = color1.substring(1);
    }
    if (color2.length === 4) {
      color2 = color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
    } else {
      color2 = color2.substring(1);
    }
    // 3: we have valid input, convert colors to rgb
    color1 = [parseInt(color1[0] + color1[1], 16), parseInt(color1[2] + color1[3], 16), parseInt(color1[4] + color1[5], 16)];
    color2 = [parseInt(color2[0] + color2[1], 16), parseInt(color2[2] + color2[3], 16), parseInt(color2[4] + color2[5], 16)];
    // 4: blend
    const color3 = [
      (1 - percentage) * color1[0] + percentage * color2[0],
      (1 - percentage) * color1[1] + percentage * color2[1],
      (1 - percentage) * color1[2] + percentage * color2[2]
    ];
    // return hex
    return '#' + ColorLib.int_to_hex(color3[0]) + ColorLib.int_to_hex(color3[1]) + ColorLib.int_to_hex(color3[2]);
  }

  /*
      convert a Number to a two character hex string
      must round, or we will end up with more digits than expected (2)
      note: can also result in single digit, which will need to be padded with a 0 to the left
      @param: num         => the number to conver to hex
      @returns: string    => the hex representation of the provided number
  */
  static int_to_hex(num: number) {
    let hex = Math.round(num).toString(16);
    if (hex.length === 1) {
      hex = '0' + hex;
    }
    return hex;
  }
}
