/*! Built with http://stenciljs.com */
quantumviz.loadBundle("chunk-a0ba8c72.js", ["exports"], function (t) { window.quantumviz.h;
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
        e.merge = function (t, r, a) { for (var i in t)
            t.hasOwnProperty(i) && (a && "[object Object]" === Object.prototype.toString.call(t[i]) ? r[i] = e.mergeDeep(r[i], t[i]) : r[i] = t[i]); };
        e.isObject = function (t) { return t && "object" == typeof t && !Array.isArray(t); };
        e.getGridColor = function (t) { return "#8e8e8e"; };
        e.getTooltipCallbacks = function () { return { title: function (t) { return t[0].xLabel; }, label: function (t, e) { var r = e.datasets[t.datasetIndex].label || ""; return r && (r += ": "), r + t.yLabel; } }; };
        e.buildImage = function (t, e, r) { var a = new Image(t, e), i = "<svg width=\"" + t + "px\" height=\"" + e + "px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 " + t + " " + e + "\" preserveAspectRatio=\"xMidYMid\">\n<rect width=\"" + t + "\" height=\"" + e + "\" style=\"fill:" + r + ";\" />\n</svg>"; return a.src = "data:image/svg+xml;base64," + btoa(i), a; };
        return e;
    }());  t.ChartLib = e; });
