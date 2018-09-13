/*! Built with http://stenciljs.com */
quantumviz.loadBundle("chunk-40dfdfe8.js", ["exports"], function (o) { var s; window.quantumviz.h, function (o) { o[o.DEBUG = 0] = "DEBUG", o[o.ERROR = 1] = "ERROR", o[o.WARN = 2] = "WARN", o[o.INFO = 3] = "INFO"; }(s || (s = {})), o.Logger = /** @class */ (function () {
    function Logger(o) {
        this.className = o.name;
    }
    Logger.prototype.log = function (o, e, a) { var n = "[" + this.className + "] " + e.join(" - "); switch (o) {
        case s.DEBUG: break;
        case s.ERROR:
            console.error(n, a);
            break;
        case s.INFO:
            console.log(n, a);
            break;
        case s.WARN:
            console.warn(n, a);
            break;
        default: console.log(n, a);
    } };
    Logger.prototype.debug = function (o, e) { this.log(s.DEBUG, o, e); };
    Logger.prototype.error = function (o, e) { this.log(s.ERROR, o, e); };
    Logger.prototype.warn = function (o, e) { this.log(s.WARN, o, e); };
    Logger.prototype.info = function (o, e) { this.log(s.INFO, o, e); };
    return Logger;
}()); });
