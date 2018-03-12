export class GTSLib {

  color = ['#4D4D4D', '#5DA5DA', '#FAA43A', '#60BD68', '#F17CB0', '#B2912F', '#B276B2', '#DECF3F', '#F15854', '#607D8B'];

  /**
   * Get a color from index
   * @param i
   * @returns {string}
   */
  getColor(i) {
    return this.color[i % this.color.length]
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
  isArray(value) {
    return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number'
      && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
  }

  isValidResponse(data) {
    let response;
    try {
      response = JSON.parse(data);
    } catch (e) {
      console.error('Response non JSON compliant', data);
      return false;
    }
    if (!this.isArray(response)) {
      console.error('Response isn\'t an Array', response);
      return false;
    }
    return true;
  }

  isEmbeddedImage(item) {
    return !(typeof item !== 'string' || !/^data:image/.test(item));
  }

  isEmbeddedImageObject(item) {
    return !((item === null) || (item.image === null) ||
      (item.caption === null) || !this.isEmbeddedImage(item.image));
  }

  isPositionArray(item) {
    if (!item || !item.positions) {
      return false;
    }
    if (this.isPositionsArrayWithValues(item) || this.isPositionsArrayWithTwoValues(item)) {
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

  isPositionsArrayWithValues(item) {
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

  isPositionsArrayWithTwoValues(item) {
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

  metricFromJSON(json) {
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

  gtsFromJSON(json, id) {
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

  gtsFromJSONList(jsonList, prefixId) {
    let gts;
    let gtsList = [];
    let i;
    let id;
    for (i = 0; i < jsonList.length; i++) {
      gts = jsonList[i];
      if ((prefixId !== undefined) && (prefixId !== '')) {
        id = prefixId + '-' + i;
      } else {
        id = '' + i;
      }
      if (this.isArray(gts)) {
        gtsList.push(this.gtsFromJSONList(gts, id));
      }
      if (this.isGts(gts)) {
        gtsList.push(this.gtsFromJSON(gts, id));
      }
      if (this.isEmbeddedImage(gts)) {
        gtsList.push({
          image: gts,
          caption: 'Image',
          id: id,
        });
      }
      if (this.isEmbeddedImageObject(gts)) {
        gtsList.push({
          image: gts.image,
          caption: gts.caption,
          id: id,
        });
      }
    }
    return {
      content: gtsList,
    };
  }

  flattenGtsIdArray(a, r) {
    let elem;
    let j;
    if (!r) {
      r = [];
    }
    for (j = 0; j < a.content.length; j++) {
      elem = a.content[j];
      if (elem.content) {
        this.flattenGtsIdArray(elem, r);
      } else {
        if (elem.gts) {
          r.push(elem.gts);
        }
      }
    }
    return r;
  }

  serializeGtsMetadata(gts) {
    let serializedLabels = [];
    Object.keys(gts.l).forEach((key) => {
      serializedLabels.push(key + '=' + gts.l[key]);
    });
    return (gts.id ? (gts.id + ' ') : '') + gts.c + '{' + serializedLabels.join(',') + '}';
  }

  gtsToPath(gts) {
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

  equalMetadata(a, b) {
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

  isGts(item) {
    return !(!item || item === null || item.c === null || item.l === null ||
      item.a === null || item.v === null || !this.isArray(item.v));
  }

  isGtsToPlot(gts) {
    if (!this.isGts(gts) || gts.v.length === 0) {
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

  isGtsToAnnotate(gts) {
    if (!this.isGts(gts) || gts.v.length === 0) {
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

  gtsSort(gts) {
    if (gts.isSorted) {
      return;
    }
    gts.v = gts.v.sort(function (a, b) {
      return a[0] - b[0];
    });
    gts.isSorted = true;
  }

  gtsTimeRange(gts) {
    this.gtsSort(gts);
    if (gts.v.length === 0) {
      return null;
    }
    return [gts.v[0][0], gts.v[gts.v.length - 1][0]];
  }

}
