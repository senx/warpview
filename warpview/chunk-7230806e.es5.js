/*! Built with http://stenciljs.com */
warpview.loadBundle("chunk-7230806e.js", ["exports"], function (t) { var e; window.warpview.h, function (t) { t[t.DEBUG = 0] = "DEBUG", t[t.ERROR = 1] = "ERROR", t[t.WARN = 2] = "WARN", t[t.INFO = 3] = "INFO"; }(e || (e = {}));
    var r = /** @class */ (function () {
        function r() {
        }
        r.guid = function () { var t, e, r = ""; for (t = 0; t < 32; t++)
            e = 16 * Math.random() | 0, 8 != t && 12 != t && 16 != t && 20 != t || (r += "-"), r += (12 == t ? 4 : 16 == t ? 3 & e | 8 : e).toString(16); return r; };
        r.mergeDeep = function () {
            var t = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                t[_i] = arguments[_i];
            }
            var e = {}, s = 0;
            for (; s < arguments.length; s++) {
                var t_1 = arguments[s];
                r.merge(t_1, e, !0);
            }
            return e;
        };
        r.merge = function (t, e, s) { for (var a in t)
            t.hasOwnProperty(a) && (s && "[object Object]" === Object.prototype.toString.call(t[a]) ? e[a] = r.mergeDeep(e[a], t[a]) : e[a] = t[a]); };
        r.isObject = function (t) { return t && "object" == typeof t && !Array.isArray(t); };
        r.getTooltipCallbacks = function () { return { title: function (t) { return t[0].xLabel; }, label: function (t, e) { var r = e.datasets[t.datasetIndex].label || ""; return r && (r += ": "), r + t.yLabel; } }; };
        r.buildImage = function (t, e, r) { var s = new Image(t, e), a = "<svg width=\"" + t + "px\" height=\"" + e + "px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 " + t + " " + e + "\" preserveAspectRatio=\"xMidYMid\">\n<rect width=\"" + t + "\" height=\"" + e + "\" style=\"fill:" + r + ";\" ></rect>\n</svg>"; return s.src = "data:image/svg+xml;base64," + btoa(a), s; };
        return r;
    }());  t.Logger = /** @class */ (function () {
    function Logger(t) {
        this.className = t.name;
    }
    Logger.isArray = function (t) { return t && "object" == typeof t && t instanceof Array && "number" == typeof t.length && "function" == typeof t.splice && !t.propertyIsEnumerable("length"); };
    Logger.prototype.log = function (t, r, s) { var a = []; switch ((a.push("[" + this.className + "] " + r.join(" - ")), a = a.concat(s), t)) {
        case e.DEBUG: break;
        case e.ERROR:
            console.error.apply(console, a);
            break;
        case e.INFO:
            console.log.apply(console, a);
            break;
        case e.WARN:
            console.warn.apply(console, a);
            break;
        default: console.log.apply(console, a);
    } };
    Logger.prototype.debug = function (t) {
        var r = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            r[_i - 1] = arguments[_i];
        }
        this.log(e.DEBUG, t, r);
    };
    Logger.prototype.error = function (t) {
        var r = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            r[_i - 1] = arguments[_i];
        }
        this.log(e.ERROR, t, r);
    };
    Logger.prototype.warn = function (t) {
        var r = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            r[_i - 1] = arguments[_i];
        }
        this.log(e.WARN, t, r);
    };
    Logger.prototype.info = function (t) {
        var r = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            r[_i - 1] = arguments[_i];
        }
        this.log(e.INFO, t, r);
    };
    return Logger;
}()), t.Param = /** @class */ (function () {
    function Param() {
        this.showDots = !0, this.timeUnit = "us";
    }
    return Param;
}()), t.ChartLib = r; });
