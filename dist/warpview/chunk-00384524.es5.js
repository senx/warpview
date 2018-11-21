/*! Built with http://stenciljs.com */
warpview.loadBundle("chunk-00384524.js", ["exports"], function (t) { window.warpview.h;
    var e = /** @class */ (function () {
        function e() {
        }
        return e;
    }()); 
    var r = /** @class */ (function () {
        function r() {
        }
        r.cleanArray = function (t) { return t.filter(function (t) { return !!t; }); };
        r.unique = function (t) { var e = {}, r = []; for (var n_1 = 0, s_1 = t.length; n_1 < s_1; ++n_1)
            e.hasOwnProperty(t[n_1]) || (r.push(t[n_1]), e[t[n_1]] = 1); return r; };
        r.isArray = function (t) { return t && "object" == typeof t && t instanceof Array && "number" == typeof t.length && "function" == typeof t.splice && !t.propertyIsEnumerable("length"); };
        r.isValidResponse = function (t) { var e; try {
            e = JSON.parse(t);
        }
        catch (e) {
            return console.error("Response non JSON compliant", t), !1;
        } return !!r.isArray(e) || (console.error("Response isn't an Array", e), !1); };
        r.isEmbeddedImage = function (t) { return !("string" != typeof t || !/^data:image/.test(t)); };
        r.isEmbeddedImageObject = function (t) { return !(null === t || null === t.image || null === t.caption || !r.isEmbeddedImage(t.image)); };
        r.isPositionArray = function (t) { if (!t || !t.positions)
            return !1; if (r.isPositionsArrayWithValues(t) || r.isPositionsArrayWithTwoValues(t))
            return !0; for (var e_1 in t.positions) {
            if (t.positions[e_1].length < 2 || t.positions[e_1].length > 3)
                return !1;
            for (var r_1 in t.positions[e_1])
                if ("number" != typeof t.positions[e_1][r_1])
                    return !1;
        } return !0; };
        r.isPositionsArrayWithValues = function (t) { if (null === t || null === t.positions)
            return !1; for (var e_2 in t.positions) {
            if (3 !== t.positions[e_2].length)
                return !1;
            for (var r_2 in t.positions[e_2])
                if ("number" != typeof t.positions[e_2][r_2])
                    return !1;
        } return !0; };
        r.isPositionsArrayWithTwoValues = function (t) { if (null === t || null === t.positions)
            return !1; for (var e_3 in t.positions) {
            if (4 !== t.positions[e_3].length)
                return !1;
            for (var r_3 in t.positions[e_3])
                if ("number" != typeof t.positions[e_3][r_3])
                    return !1;
        } return !0; };
        r.metricFromJSON = function (t) { var e = { ts: t[0], value: void 0, alt: void 0, lon: void 0, lat: void 0 }; switch (t.length) {
            case 2:
                e.value = t[1];
                break;
            case 3:
                e.alt = t[1], e.value = t[2];
                break;
            case 4:
                e.lat = t[1], e.lon = t[2], e.value = t[3];
                break;
            case 5: e.lat = t[1], e.lon = t[2], e.alt = t[3], e.value = t[4];
        } return e; };
        r.gtsFromJSON = function (t, e) { return { gts: { c: t.c, l: t.l, a: t.a, v: t.v, id: e } }; };
        r.gtsFromJSONList = function (t, e) { var n, s = []; return (t || []).forEach(function (t, i) { var o = t; t.gts && (o = t.gts), n = void 0 !== e && "" !== e ? e + "-" + i : i, r.isArray(o) && s.push(r.gtsFromJSONList(o, n)), r.isGts(o) && s.push(r.gtsFromJSON(o, n)), r.isEmbeddedImage(o) && s.push({ image: o, caption: "Image", id: n }), r.isEmbeddedImageObject(o) && s.push({ image: o.image, caption: o.caption, id: n }); }), { content: s || [] }; };
        r.flatDeep = function (t) { return t.reduce(function (t, e) { return Array.isArray(e) ? t.concat(r.flatDeep(e)) : t.concat(e); }, []); };
        r.flattenGtsIdArray = function (t, e) { var n, s; for (e || (e = []), s = 0; s < t.content.length; s++)
            (n = t.content[s]).content ? r.flattenGtsIdArray(n, e) : n.gts && e.push(n.gts); return e; };
        r.serializeGtsMetadata = function (t) { var e = []; Object.keys(t.l).forEach(function (r) { e.push(r + "=" + t.l[r]); }); var r = []; return Object.keys(t.a).forEach(function (e) { r.push(e + "=" + t.a[e]); }), t.c + "{" + e.join(",") + (r.length > 0 ? "," : "") + r.join(",") + "}"; };
        r.gtsToPath = function (t) { var e = []; t.v = t.v.sort(function (t, e) { return t[0] - e[0]; }); for (var r_4 = 0; r_4 < t.v.length; r_4++) {
            var n_2 = t.v[r_4];
            n_2.length, n_2.length, 4 === n_2.length && e.push({ ts: Math.floor(n_2[0] / 1e3), lat: n_2[1], lon: n_2[2], val: n_2[3] }), 5 === n_2.length && e.push({ ts: Math.floor(n_2[0] / 1e3), lat: n_2[1], lon: n_2[2], elev: n_2[3], val: n_2[4] });
        } return e; };
        r.equalMetadata = function (t, e) { if (!(void 0 !== t.c && void 0 !== e.c && void 0 !== t.l && void 0 !== e.l && t.l instanceof Object && e.l instanceof Object))
            return console.error("[warp10-gts-tools] equalMetadata - Error in GTS, metadata is not well formed"), !1; if (t.c !== e.c)
            return !1; for (var r_5 in t.l) {
            if (!e.l.hasOwnProperty(r_5))
                return !1;
            if (t.l[r_5] !== e.l[r_5])
                return !1;
        } for (var r_6 in e.l)
            if (!t.l.hasOwnProperty(r_6))
                return !1; return !0; };
        r.isGts = function (t) { return !(!t || null === t || null === t.c || null === t.l || null === t.a || null === t.v || !r.isArray(t.v)); };
        r.isGtsToPlot = function (t) { if (!r.isGts(t) || 0 === t.v.length)
            return !1; for (var e_4 = 0; e_4 < t.v.length; e_4++)
            if (null !== t.v[e_4][t.v[e_4].length - 1]) {
                if ("number" == typeof t.v[e_4][t.v[e_4].length - 1] || void 0 !== t.v[e_4][t.v[e_4].length - 1].constructor.prototype.toFixed)
                    return !0;
                break;
            } return !1; };
        r.isBooleanGts = function (t) { if (!r.isGts(t) || 0 === t.v.length)
            return !1; for (var e_5 = 0; e_5 < t.v.length; e_5++)
            if (null !== t.v[e_5][t.v[e_5].length - 1]) {
                if ("boolean" != typeof t.v[e_5][t.v[e_5].length - 1])
                    return !0;
                break;
            } return !1; };
        r.isGtsToAnnotate = function (t) { if (!r.isGts(t) || 0 === t.v.length)
            return !1; for (var e_6 = 0; e_6 < t.v.length; e_6++)
            if (null !== t.v[e_6][t.v[e_6].length - 1]) {
                if ("number" != typeof t.v[e_6][t.v[e_6].length - 1] && t.v[e_6][t.v[e_6].length - 1].constructor && "Big" !== t.v[e_6][t.v[e_6].length - 1].constructor.name && void 0 === t.v[e_6][t.v[e_6].length - 1].constructor.prototype.toFixed)
                    return !0;
                break;
            } return !1; };
        r.gtsSort = function (t) { t.isSorted || (t.v = t.v.sort(function (t, e) { return t[0] - e[0]; }), t.isSorted = !0); };
        r.gtsTimeRange = function (t) { return r.gtsSort(t), 0 === t.v.length ? null : [t.v[0][0], t.v[t.v.length - 1][0]]; };
        r.getData = function (t) { return "string" == typeof t ? r.getData(JSON.parse(t)) : t && t.hasOwnProperty("data") ? t : r.isArray(t) && t.length > 0 && t[0].data ? t[0] : r.isArray(t) ? { data: t } : new e; };
        return r;
    }());  var n; !function (t) { t[t.DEBUG = 0] = "DEBUG", t[t.ERROR = 1] = "ERROR", t[t.WARN = 2] = "WARN", t[t.INFO = 3] = "INFO"; }(n || (n = {}));
    var s = /** @class */ (function () {
        function s() {
        }
        s.guid = function () { var t, e, r = ""; for (t = 0; t < 32; t++)
            e = 16 * Math.random() | 0, 8 != t && 12 != t && 16 != t && 20 != t || (r += "-"), r += (12 == t ? 4 : 16 == t ? 3 & e | 8 : e).toString(16); return r; };
        s.mergeDeep = function () {
            var t = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                t[_i] = arguments[_i];
            }
            var e = {}, r = 0;
            for (; r < arguments.length; r++) {
                var t_1 = arguments[r];
                s.merge(t_1, e, !0);
            }
            return e;
        };
        s.merge = function (t, e, r) { for (var n_3 in t)
            t.hasOwnProperty(n_3) && (r && "[object Object]" === Object.prototype.toString.call(t[n_3]) ? e[n_3] = s.mergeDeep(e[n_3], t[n_3]) : e[n_3] = t[n_3]); };
        s.isObject = function (t) { return t && "object" == typeof t && !Array.isArray(t); };
        s.getTooltipCallbacks = function () { return { title: function (t) { return t[0].xLabel; }, label: function (t, e) { var r = e.datasets[t.datasetIndex].label || ""; return r && (r += ": "), r + t.yLabel; } }; };
        s.buildImage = function (t, e, r) { var n = new Image(t, e), s = "<svg width=\"" + t + "px\" height=\"" + e + "px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 " + t + " " + e + "\" preserveAspectRatio=\"xMidYMid\">\n<rect width=\"" + t + "\" height=\"" + e + "\" style=\"fill:" + r + ";\" />\n</svg>"; return n.src = "data:image/svg+xml;base64," + btoa(s), n; };
        return s;
    }());  t.GTSLib = r, t.Logger = /** @class */ (function () {
    function Logger(t) {
        this.className = t.name;
    }
    Logger.prototype.log = function (t, e, r) { var s = "[" + this.className + "] " + e.join(" - "); switch (t) {
        case n.DEBUG: break;
        case n.ERROR:
            console.error(s, r);
            break;
        case n.INFO:
            console.log(s, r);
            break;
        case n.WARN:
            console.warn(s, r);
            break;
        default: console.log(s, r);
    } };
    Logger.prototype.debug = function (t, e) { this.log(n.DEBUG, t, e); };
    Logger.prototype.error = function (t, e) { this.log(n.ERROR, t, e); };
    Logger.prototype.warn = function (t, e) { this.log(n.WARN, t, e); };
    Logger.prototype.info = function (t, e) { this.log(n.INFO, t, e); };
    return Logger;
}()), t.Param = /** @class */ (function () {
    function Param() {
    }
    return Param;
}()), t.ChartLib = s, t.DataModel = e; });
