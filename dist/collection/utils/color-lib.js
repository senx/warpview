/*
 *
 *    Copyright 2016  Cityzen Data
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
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
     * @param {number} alpha
     * @returns {string}
     */
    static transparentize(color, alpha) {
        return 'rgba(' + ColorLib.hexToRgb(color).concat(alpha).join(',') + ')';
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
            color.push(ColorLib.transparentize(ColorLib.getColor(i), 0.5));
        }
        return color;
    }
}
ColorLib.color = ['#5899DA', '#E8743B', '#19A979', '#ED4A7B', '#945ECF', '#13A4B4', '#525DF4', '#BF399E', '#6C8893', '#EE6868', '#2F6497'];
