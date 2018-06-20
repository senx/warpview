export class GTSLib {

  static color = ['#4D4D4D', '#5DA5DA', '#FAA43A', '#60BD68', '#F17CB0', '#B2912F', '#B276B2', '#DECF3F', '#F15854', '#607D8B'];

  /**
   * Get a color from index
   * @param i
   * @returns {string}
   */
  static getColor(i) {
    return GTSLib.color[i % GTSLib.color.length]
  }

  /**
   * Return a Set
   * @param arr
   * @returns {any[]}
   */
  static unique(arr) {
    let u = {}, a = [];
    for (let i = 0, l = arr.length; i < l; ++i) {
      if (!u.hasOwnProperty(arr[i])) {
        a.push(arr[i]);
        u[arr[i]] = 1;
      }
    }
    return a;
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
  static transparentize(color, alpha: number): string {
    return 'rgba(' + GTSLib.hexToRgb(color).concat(alpha).join(',') + ')';
  }

  /**
   * Test if value is an array
   * @param value
   * @returns {any | boolean}
   */
  static isArray(value) {
    return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number'
      && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
  }

  static isValidResponse(data) {
    let response;
    try {
      response = JSON.parse(data);
    } catch (e) {
      console.error('Response non JSON compliant', data);
      return false;
    }
    if (!GTSLib.isArray(response)) {
      console.error('Response isn\'t an Array', response);
      return false;
    }
    return true;
  }

  static isEmbeddedImage(item) {
    return !(typeof item !== 'string' || !/^data:image/.test(item));
  }

  static isEmbeddedImageObject(item) {
    return !((item === null) || (item.image === null) ||
      (item.caption === null) || !GTSLib.isEmbeddedImage(item.image));
  }

  static isPositionArray(item) {
    if (!item || !item.positions) {
      return false;
    }
    if (GTSLib.isPositionsArrayWithValues(item) || GTSLib.isPositionsArrayWithTwoValues(item)) {
      return true;
    }
    for (let i in item.positions) {
      if (item.positions[i].length < 2 || item.positions[i].length > 3) {
        return false;
      }
      for (let j in item.positions[i]) {
        if (typeof item.positions[i][j] !== 'number') {
          return false;
        }
      }
    }
    return true;
  }

  static isPositionsArrayWithValues(item) {
    if ((item === null) || (item.positions === null)) {
      return false;
    }
    for (let i in item.positions) {
      if (item.positions[i].length !== 3) {
        return false;
      }
      for (let j in item.positions[i]) {
        if (typeof item.positions[i][j] !== 'number') {
          return false;
        }
      }
    }
    return true;
  }

  static isPositionsArrayWithTwoValues(item) {
    if ((item === null) || (item.positions === null)) {
      return false;
    }
    for (let i in item.positions) {
      if (item.positions[i].length !== 4) {
        return false;
      }
      for (let j in item.positions[i]) {
        if (typeof item.positions[i][j] !== 'number') {
          return false;
        }
      }
    }
    return true;
  }

  static metricFromJSON(json) {
    let metric = {
      ts: json[0],
      value: undefined,
      alt: undefined,
      lon: undefined,
      lat: undefined
    };
    switch (json.length) {
      case 2:
        metric.value = json[1];
        break;
      case 3:
        metric.alt = json[1];
        metric.value = json[2];
        break;
      case 4:
        metric.lat = json[1];
        metric.lon = json[2];
        metric.value = json[3];
        break;
      case 5:
        metric.lat = json[1];
        metric.lon = json[2];
        metric.alt = json[3];
        metric.value = json[4];
    }
    return metric;
  }

  static gtsFromJSON(json, id) {
    return {
      gts: {
        c: json.c,
        l: json.l,
        a: json.a,
        v: json.v,
        id: id,
      },
    };
  }

  /**
   *
   * @param jsonList
   * @param prefixId
   * @returns {{content: any[]}}
   */
  static gtsFromJSONList(jsonList, prefixId) {
    let gtsList = [];
    let id;
    jsonList.forEach((item, i) => {
      let gts = item;
      if(item.gts) {
        gts = item.gts;
      }
      if ((prefixId !== undefined) && (prefixId !== '')) {
        id = prefixId + '-' + i;
      } else {
        id = '' + i;
      }
      if (GTSLib.isArray(gts)) {
        gtsList.push(GTSLib.gtsFromJSONList(gts, id));
      }
      if (GTSLib.isGts(gts)) {
        gtsList.push(GTSLib.gtsFromJSON(gts, id));
      }
      if (GTSLib.isEmbeddedImage(gts)) {
        gtsList.push({
          image: gts,
          caption: 'Image',
          id: id,
        });
      }
      if (GTSLib.isEmbeddedImageObject(gts)) {
        gtsList.push({
          image: gts.image,
          caption: gts.caption,
          id: id,
        });
      }
    });
    return {
      content: gtsList,
    };
  }

  /**
   *
   * @param arr1
   * @returns {any}
   */
  static flatDeep(arr1) {
    return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(GTSLib.flatDeep(val)) : acc.concat(val), []);
  };

  /**
   *
   * @param a
   * @param r
   * @returns {any}
   */
  static flattenGtsIdArray(a, r) {
    let elem;
    let j;
    if (!r) {
      r = [];
    }
    for (j = 0; j < a.content.length; j++) {
      elem = a.content[j];
      if (elem.content) {
        GTSLib.flattenGtsIdArray(elem, r);
      } else {
        if (elem.gts) {
          r.push(elem.gts);
        }
      }
    }
    return r;
  }

  static serializeGtsMetadata(gts) {
    let serializedLabels = [];
    Object.keys(gts.l).forEach((key) => {
      serializedLabels.push(key + '=' + gts.l[key]);
    });
    return (gts.id ? (gts.id + ' ') : '') + gts.c + '{' + serializedLabels.join(',') + '}';
  }

  static gtsToPath(gts) {
    let path = [];
    // Sort values
    gts.v = gts.v.sort(function (a, b) {
      return a[0] - b[0];
    });
    for (let i = 0; i < gts.v.length; i++) {
      let metric = gts.v[i];
      if (metric.length === 2) {
        // timestamp, value
      }
      if (metric.length === 3) {
        // timestamp, elevation, value
      }
      if (metric.length === 4) {
        // timestamp, lat, lon, value
        path.push({ts: Math.floor(metric[0] / 1000), lat: metric[1], lon: metric[2], val: metric[3]});
      }
      if (metric.length === 5) {
        // timestamp, lat, lon, elevation, value
        path.push({
          ts: Math.floor(metric[0] / 1000),
          lat: metric[1],
          lon: metric[2],
          elev: metric[3],
          val: metric[4],
        });
      }
    }
    return path;
  }

  static equalMetadata(a, b) {
    if (a.c === undefined || b.c === undefined || a.l === undefined || b.l === undefined ||
      !(a.l instanceof Object) || !(b.l instanceof Object)) {
      console.error('[warp10-gts-tools] equalMetadata - Error in GTS, metadata is not well formed');
      return false;
    }
    if (a.c !== b.c) {
      return false;
    }
    for (let p in a.l) {
      if (!b.l.hasOwnProperty(p)) return false;
      if (a.l[p] !== b.l[p]) return false;
    }
    for (let p in b.l) {
      if (!a.l.hasOwnProperty(p)) return false;
    }
    return true;
  }

  static isGts(item) {
    return !(!item || item === null || item.c === null || item.l === null ||
      item.a === null || item.v === null || !GTSLib.isArray(item.v));
  }

  static isGtsToPlot(gts) {
    if (!GTSLib.isGts(gts) || gts.v.length === 0) {
      return false;
    }
    // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
    // if it's a number it's a GTS to plot
    for (let i = 0; i < gts.v.length; i++) {
      if (gts.v[i][gts.v[i].length - 1] !== null) {
        // console.log("[warp10-gts-tools] isGtsToPlot - First value type", gts.v[i][gts.v[i].length - 1] );
        if (typeof (gts.v[i][gts.v[i].length - 1]) === 'number' ||
          // gts.v[i][gts.v[i].length - 1].constructor.name === 'Big' ||
          gts.v[i][gts.v[i].length - 1].constructor.prototype.toFixed !== undefined) {
          return true;
        }
        break;
      }
    }
    return false;
  }

  static isGtsToAnnotate(gts) {
    if (!GTSLib.isGts(gts) || gts.v.length === 0) {
      return false;
    }
    // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
    // if it's a number it's a GTS to plot
    for (let i = 0; i < gts.v.length; i++) {
      if (gts.v[i][gts.v[i].length - 1] !== null) {
        if (typeof (gts.v[i][gts.v[i].length - 1]) !== 'number' &&
          (!!gts.v[i][gts.v[i].length - 1].constructor &&
            gts.v[i][gts.v[i].length - 1].constructor.name !== 'Big') &&
          gts.v[i][gts.v[i].length - 1].constructor.prototype.toFixed === undefined) {
          return true;
        }
        break;
      }
    }
    return false;
  }

  static gtsSort(gts) {
    if (gts.isSorted) {
      return;
    }
    gts.v = gts.v.sort(function (a, b) {
      return a[0] - b[0];
    });
    gts.isSorted = true;
  }

  static gtsTimeRange(gts) {
    GTSLib.gtsSort(gts);
    if (gts.v.length === 0) {
      return null;
    }
    return [gts.v[0][0], gts.v[gts.v.length - 1][0]];
  }

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

    if (GTSLib.isObject(target) && GTSLib.isObject(source)) {
      for (const key in source) {
        if (GTSLib.isObject(source[key])) {
          if (!target[key]) Object.assign(target, {[key]: {}});
          GTSLib.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, {[key]: source[key]});
        }
      }
    }

    return GTSLib.mergeDeep(target, ...sources);
  }

  static isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

}
