/*! Built with http://stenciljs.com */
quantumviz.loadBundle("chunk-9fb8bfd0.js", ["exports"], function (t) { window.quantumviz.h;
    var e = /** @class */ (function () {
        function e() {
        }
        e.guid = function () { var t, e, i = ""; for (t = 0; t < 32; t++)
            e = 16 * Math.random() | 0, 8 != t && 12 != t && 16 != t && 20 != t || (i += "-"), i += (12 == t ? 4 : 16 == t ? 3 & e | 8 : e).toString(16); return i; };
        e.mergeDeep = function (t) {
            var i = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                i[_i - 1] = arguments[_i];
            }
            var _a, _b;
            if (!i.length)
                return t;
            var r = i.shift();
            if (e.isObject(t) && e.isObject(r))
                for (var i_1 in r)
                    e.isObject(r[i_1]) ? (t[i_1] || Object.assign(t, (_a = {}, _a[i_1] = {}, _a)), e.mergeDeep(t[i_1], r[i_1])) : Object.assign(t, (_b = {}, _b[i_1] = r[i_1], _b));
            return e.mergeDeep.apply(e, [t].concat(i));
        };
        e.isObject = function (t) { return t && "object" == typeof t && !Array.isArray(t); };
        e.getGridColor = function (t) { return "#8e8e8e"; };
        e.getTooltipCallbacks = function () { return { title: function (t) { return t[0].xLabel; }, label: function (t, e) { var i = e.datasets[t.datasetIndex].label || ""; return i && (i += ": "), i + t.yLabel; } }; };
        e.buildImage = function (t, e, i) { var r = new Image(t, e), s = "<svg width=\"" + t + "px\" height=\"" + e + "px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 " + t + " " + e + "\" preserveAspectRatio=\"xMidYMid\">\n<rect width=\"" + t + "\" height=\"" + e + "\" style=\"fill:" + i + ";\" />\n</svg>"; return r.src = "data:image/svg+xml;base64," + btoa(s), r; };
        return e;
    }());  t.ChartLib = e; });
