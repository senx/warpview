/*
 *  Copyright 2018  SenX S.A.S.
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
export class ColorLib {
    /**
     * Get a color from index
     * @param i
     * @returns {string}
     */
    static getColor(i) {
        return ColorLib.color[i % ColorLib.color.length];
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
     * @param color
     * @returns {string}
     */
    static transparentize(color) {
        return 'rgba(' + ColorLib.hexToRgb(color).concat(0.7).join(',') + ')';
    }
    /**
     *
     * @param num
     */
    static generateColors(num) {
        let color = [];
        for (let i = 0; i < num; i++) {
            color.push(ColorLib.getColor(i));
        }
        return color;
    }
    /**
     *
     * @param num
     */
    static generateTransparentColors(num) {
        let color = [];
        for (let i = 0; i < num; i++) {
            color.push(ColorLib.transparentize(ColorLib.getColor(i)));
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
    static rgb2hsv(r, g, b) {
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
        }
        else {
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
    static hsvGradient(c1, c2, steps) {
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
            gradient[i] = { h: h, s: s, v: v };
        }
        return gradient;
    }
    static hsv2rgb(h, s, v) {
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
ColorLib.color = [
    '#E53935',
    '#1E88E5',
    '#7CB342',
    '#F4511E',
    '#D81B60',
    '#039BE5',
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
    '#FB8C00'
];
