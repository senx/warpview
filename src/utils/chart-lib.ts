export class ChartLib {


  /**
   * Generate a guid
   * @returns {string}
   */
  static guid() {
    let uuid = '', i, random;
    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i == 8 || i == 12 || i == 16 || i == 20) {
        uuid += "-"
      }
      uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
  }

  /**
   *
   * @param target
   * @param sources
   * @returns {any}
   */
  static mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (ChartLib.isObject(target) && ChartLib.isObject(source)) {
      for (const key in source) {
        if (ChartLib.isObject(source[key])) {
          if (!target[key]) Object.assign(target, {[key]: {}});
          ChartLib.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, {[key]: source[key]});
        }
      }
    }

    return ChartLib.mergeDeep(target, ...sources);
  }

  /**
   *
   * @param item
   */
  static isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  /**
   *
   * @param theme
   */
  static getGridColor(theme: string) {
    return theme === 'light' ? '#8e8e8e' : '#8e8e8e';
  }

  static getTooltipCallbacks() {
    return {
      title: (tooltipItem) => {
        return tooltipItem[0].xLabel
      },
      label: (tooltipItem, data)  => {
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
    const svg = `<svg width="${w}px" height="${h}px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid">
<rect width="${w}" height="${h}" style="fill:${color};" />
</svg>`;
    // 	myImage.src = "ripple.svg"
    img.src = "data:image/svg+xml;base64," + btoa(svg);
    return img;
  }
}
