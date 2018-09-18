/*! Built with http://stenciljs.com */
quantumviz.loadBundle("chunk-87d66f99.js", ["exports"], function (e) { var o; window.quantumviz.h, function (e) { e[e.DEBUG = 0] = "DEBUG", e[e.ERROR = 1] = "ERROR", e[e.WARN = 2] = "WARN", e[e.INFO = 3] = "INFO"; }(o || (o = {}));
    var t = /** @class */ (function () {
        function t() {
        }
        t.getColor = function (e) { return t.color[e % t.color.length]; };
        t.hexToRgb = function (e) { var o = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e); return o ? [parseInt(o[1], 16), parseInt(o[2], 16), parseInt(o[3], 16)] : null; };
        t.transparentize = function (e, o) { return "rgba(" + t.hexToRgb(e).concat(o).join(",") + ")"; };
        t.generateColors = function (e) { var o = []; for (var r = 0; r < e; r++)
            o.push(t.getColor(r)); return o; };
        t.generateTransparentColors = function (e) { var o = []; for (var r = 0; r < e; r++)
            o.push(t.transparentize(t.getColor(r), .5)); return o; };
        return t;
    }());  t.color = ["#5899DA", "#E8743B", "#19A979", "#ED4A7B", "#945ECF", "#13A4B4", "#525DF4", "#BF399E", "#6C8893", "#EE6868", "#2F6497"], e.Logger = /** @class */ (function () {
    function Logger(e) {
        this.className = e.name;
    }
    Logger.prototype.log = function (e, t, r) { var a = "[" + this.className + "] " + t.join(" - "); switch (e) {
        case o.DEBUG: break;
        case o.ERROR:
            console.error(a, r);
            break;
        case o.INFO:
            console.log(a, r);
            break;
        case o.WARN:
            console.warn(a, r);
            break;
        default: console.log(a, r);
    } };
    Logger.prototype.debug = function (e, t) { this.log(o.DEBUG, e, t); };
    Logger.prototype.error = function (e, t) { this.log(o.ERROR, e, t); };
    Logger.prototype.warn = function (e, t) { this.log(o.WARN, e, t); };
    Logger.prototype.info = function (e, t) { this.log(o.INFO, e, t); };
    return Logger;
}()), e.ColorLib = t; });
