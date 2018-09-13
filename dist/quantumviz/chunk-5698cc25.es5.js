/*! Built with http://stenciljs.com */
quantumviz.loadBundle("chunk-5698cc25.js", ["exports"], function (t) { window.quantumviz.h;
    var e = /** @class */ (function () {
        function e() {
        }
        e.getColor = function (t) { return e.color[t % e.color.length]; };
        e.hexToRgb = function (t) { var e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t); return e ? [parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16)] : null; };
        e.transparentize = function (t, r) { return "rgba(" + e.hexToRgb(t).concat(r).join(",") + ")"; };
        e.generateColors = function (t) { var r = []; for (var o = 0; o < t; o++)
            r.push(e.getColor(o)); return r; };
        e.generateTransparentColors = function (t) { var r = []; for (var o = 0; o < t; o++)
            r.push(e.transparentize(e.getColor(o), .5)); return r; };
        return e;
    }());  e.color = ["#5899DA", "#E8743B", "#19A979", "#ED4A7B", "#945ECF", "#13A4B4", "#525DF4", "#BF399E", "#6C8893", "#EE6868", "#2F6497"], t.ColorLib = e; });
