/*! Built with http://stenciljs.com */
warpview.loadBundle("chunk-9607b381.js", ["exports"], function (e) { window.warpview.h;
    var o = /** @class */ (function () {
        function o() {
        }
        o.getColor = function (e) { return o.color[e % o.color.length]; };
        o.hexToRgb = function (e) { var o = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e); return o ? [parseInt(o[1], 16), parseInt(o[2], 16), parseInt(o[3], 16)] : null; };
        o.transparentize = function (e, r) { return "rgba(" + o.hexToRgb(e).concat(r).join(",") + ")"; };
        o.generateColors = function (e) { var r = []; for (var t = 0; t < e; t++)
            r.push(o.getColor(t)); return r; };
        o.generateTransparentColors = function (e) { var r = []; for (var t = 0; t < e; t++)
            r.push(o.transparentize(o.getColor(t), .5)); return r; };
        return o;
    }());  var r; o.color = ["#5899DA", "#E8743B", "#19A979", "#ED4A7B", "#945ECF", "#13A4B4", "#525DF4", "#BF399E", "#6C8893", "#EE6868", "#2F6497"], function (e) { e[e.DEBUG = 0] = "DEBUG", e[e.ERROR = 1] = "ERROR", e[e.WARN = 2] = "WARN", e[e.INFO = 3] = "INFO"; }(r || (r = {})), e.ColorLib = o, e.Logger = /** @class */ (function () {
    function Logger(e) {
        this.className = e.name;
    }
    Logger.prototype.log = function (e, o, t) { var a = "[" + this.className + "] " + o.join(" - "); switch (e) {
        case r.DEBUG: break;
        case r.ERROR:
            console.error(a, t);
            break;
        case r.INFO:
            console.log(a, t);
            break;
        case r.WARN:
            console.warn(a, t);
            break;
        default: console.log(a, t);
    } };
    Logger.prototype.debug = function (e, o) { this.log(r.DEBUG, e, o); };
    Logger.prototype.error = function (e, o) { this.log(r.ERROR, e, o); };
    Logger.prototype.warn = function (e, o) { this.log(r.WARN, e, o); };
    Logger.prototype.info = function (e, o) { this.log(r.INFO, e, o); };
    return Logger;
}()); });
