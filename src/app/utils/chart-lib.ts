/*
 *  Copyright 2020  SenX S.A.S.
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

export class ChartLib {

  static DEFAULT_WIDTH = 640;
  static DEFAULT_HEIGHT = 480;

  static guid() {
    let uuid = '';
    let i;
    let random;
    for (i = 0; i < 32; i++) {
      // tslint:disable-next-line:no-bitwise
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      // tslint:disable-next-line:no-bitwise
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
  }

  static mergeDeep(...sources) {
    // Variables
    const extended = {};
    const deep = true;
    let i = 0;
    // Merge the object into the extended object
    // Loop through each object and conduct a merge
    for (; i < arguments.length; i++) {
      const obj = arguments[i];
      ChartLib.merge(obj, extended, deep);
    }
    return extended;
  }

  static merge(obj, extended, deep) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        // If property is an object, merge properties
        if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
          extended[prop] = ChartLib.mergeDeep(extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  }

  static isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  static getTooltipCallbacks() {
    return {
      title: (tooltipItem) => {
        return tooltipItem[0].xLabel;
      },
      label: (tooltipItem, data) => {
        let label = data.datasets[tooltipItem.datasetIndex].label || '';
        if (label) {
          label += ': ';
        }
        label += tooltipItem.yLabel;
        return label;
      }
    };
  }

  static buildImage(w: number, h: number, color: string) {
    const img = new Image(w, h);
    const svg = `<svg width="${w}px" height="${h}px" xmlns="http://www.w3.org/2000/svg"
 viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid">
<rect width="${w}" height="${h}" style="fill:${color};" ></rect>
</svg>`;
    // 	myImage.src = "ripple.svg"
    img.src = 'data:image/svg+xml;base64,' + btoa(svg);
    return img;
  }

  /**
   * Watch the parent resize of an element.
   * @param el The component Element
   * @param redrawFunction The resize or redraw function to call if container size change. don't forget to .bind(this)
   * @param period Timer component By default, 2 s
   */
  static resizeWatchTimer(el: HTMLElement, redrawFunction: () => void, period: number = 1000): number {
    let previousWidth = el.parentElement.getBoundingClientRect().width;
    let previousHeight = el.parentElement.getBoundingClientRect().height;
    return window.setInterval(() => {
      if (
        el.parentElement.getBoundingClientRect().width !== previousWidth
        || el.parentElement.getBoundingClientRect().height !== previousHeight
      ) {
        previousHeight = el.parentElement.getBoundingClientRect().height;
        previousWidth = el.parentElement.getBoundingClientRect().width;
        redrawFunction();
      }
    }, period);
  }
}
