/*! Built with http://stenciljs.com */
warpview.loadBundle("chunk-e573ad96.js", ["exports"], function (t) { window.warpview.h;
    var e = /** @class */ (function () {
        function e() {
        }
        e.guid = function () { var t, e, r = ""; for (t = 0; t < 32; t++)
            e = 16 * Math.random() | 0, 8 != t && 12 != t && 16 != t && 20 != t || (r += "-"), r += (12 == t ? 4 : 16 == t ? 3 & e | 8 : e).toString(16); return r; };
        e.mergeDeep = function () {
            var t = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                t[_i] = arguments[_i];
            }
            var r = {}, a = 0;
            for (; a < arguments.length; a++) {
                var t_1 = arguments[a];
                e.merge(t_1, r, !0);
            }
            return r;
        };
        e.merge = function (t, r, a) { for (var s in t)
            t.hasOwnProperty(s) && (a && "[object Object]" === Object.prototype.toString.call(t[s]) ? r[s] = e.mergeDeep(r[s], t[s]) : r[s] = t[s]); };
        e.isObject = function (t) { return t && "object" == typeof t && !Array.isArray(t); };
        e.getTooltipCallbacks = function () { return { title: function (t) { return t[0].xLabel; }, label: function (t, e) { var r = e.datasets[t.datasetIndex].label || ""; return r && (r += ": "), r + t.yLabel; } }; };
        e.buildImage = function (t, e, r) { var a = new Image(t, e), s = "<svg width=\"" + t + "px\" height=\"" + e + "px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 " + t + " " + e + "\" preserveAspectRatio=\"xMidYMid\">\n<rect width=\"" + t + "\" height=\"" + e + "\" style=\"fill:" + r + ";\" ></rect>\n</svg>"; return a.src = "data:image/svg+xml;base64," + btoa(s), a; };
        return e;
    }());  t.Param = /** @class */ (function () {
    function Param() {
        this.showDots = !1, this.timeUnit = "us";
    }
    return Param;
}()), t.ChartLib = e; });
