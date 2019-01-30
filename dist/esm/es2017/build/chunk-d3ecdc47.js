import { h } from '../warpview.core.js';

class ChartLib {
    static guid() {
        let uuid = '', i, random;
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i == 8 || i == 12 || i == 16 || i == 20) {
                uuid += "-";
            }
            uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    }
    static mergeDeep(...sources) {
        let extended = {};
        let deep = true;
        let i = 0;
        for (; i < arguments.length; i++) {
            const obj = arguments[i];
            ChartLib.merge(obj, extended, deep);
        }
        return extended;
    }
    static merge(obj, extended, deep) {
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                    extended[prop] = ChartLib.mergeDeep(extended[prop], obj[prop]);
                }
                else {
                    extended[prop] = obj[prop];
                }
            }
        }
    }
    ;
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
    static buildImage(w, h, color) {
        const img = new Image(w, h);
        const svg = `<svg width="${w}px" height="${h}px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid">
<rect width="${w}" height="${h}" style="fill:${color};" ></rect>
</svg>`;
        img.src = "data:image/svg+xml;base64," + btoa(svg);
        return img;
    }
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n.default || n;
}

var keys = createCommonjsModule(function (module, exports) {
exports = module.exports = typeof Object.keys === 'function'
  ? Object.keys : shim;

exports.shim = shim;
function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
});
var keys_1 = keys.shim;

var is_arguments = createCommonjsModule(function (module, exports) {
var supportsArgumentsClass = (function(){
  return Object.prototype.toString.call(arguments)
})() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}
exports.unsupported = unsupported;
function unsupported(object){
  return object &&
    typeof object == 'object' &&
    typeof object.length == 'number' &&
    Object.prototype.hasOwnProperty.call(object, 'callee') &&
    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
    false;
}});
var is_arguments_1 = is_arguments.supported;
var is_arguments_2 = is_arguments.unsupported;

var deepEqual_1 = createCommonjsModule(function (module) {
var pSlice = Array.prototype.slice;



var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {};
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
    return opts.strict ? actual === expected : actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected, opts);
  }
};

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer (x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (is_arguments(a)) {
    if (!is_arguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b, opts);
  }
  if (isBuffer(a)) {
    if (!isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  try {
    var ka = keys(a),
        kb = keys(b);
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }
  return typeof a === typeof b;
}
});

class Param {
    constructor() {
        this.showDots = false;
        this.timeUnit = 'us';
        this.timeZone = 'UTC';
    }
}

export { ChartLib as a, deepEqual_1 as b, Param as c, createCommonjsModule as d, commonjsGlobal as e, getCjsExportFromNamespace as f };
