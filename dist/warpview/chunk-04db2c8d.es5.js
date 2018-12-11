/*! Built with http://stenciljs.com */
warpview.loadBundle("chunk-04db2c8d.js", ["exports"], function (t) { window.warpview.h;
    var e = /** @class */ (function () {
        function e() {
        }
        return e;
    }()); 
    var r = /** @class */ (function () {
        function r() {
        }
        r.cleanArray = function (t) { return t.filter(function (t) { return !!t; }); };
        r.unique = function (t) { var e = {}, r = []; for (var s_1 = 0, n_1 = t.length; s_1 < n_1; ++s_1)
            e.hasOwnProperty(t[s_1]) || (r.push(t[s_1]), e[t[s_1]] = 1); return r; };
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
        r.gtsFromJSONList = function (t, e) { var s, n = []; return (t || []).forEach(function (t, o) { var i = t; t.gts && (i = t.gts), s = void 0 !== e && "" !== e ? e + "-" + o : o, r.isArray(i) && n.push(r.gtsFromJSONList(i, s)), r.isGts(i) && n.push(r.gtsFromJSON(i, s)), r.isEmbeddedImage(i) && n.push({ image: i, caption: "Image", id: s }), r.isEmbeddedImageObject(i) && n.push({ image: i.image, caption: i.caption, id: s }); }), { content: n || [] }; };
        r.flatDeep = function (t) { return t.reduce(function (t, e) { return Array.isArray(e) ? t.concat(r.flatDeep(e)) : t.concat(e); }, []); };
        r.flattenGtsIdArray = function (t, e) { var s = []; return console.log("flattenGtsIdArray", t, e), r.isGts(t) && (t = [t]), t.forEach(function (t) { if (console.log("flattenGtsIdArray a.forEach", t, e), r.isArray(t)) {
            console.log("flattenGtsIdArray d isArray");
            var n_2 = r.flattenGtsIdArray(t, e);
            s.push(n_2.res), e = n_2.r;
        }
        else
            t.v && (t.id = e, s.push(t), e++); console.log("flattenGtsIdArray res r", s, e); }), console.log("flattenGtsIdArray res", s), { res: s, r: e }; };
        r.serializeGtsMetadata = function (t) { var e = []; Object.keys(t.l).forEach(function (r) { e.push(r + "=" + t.l[r]); }); var r = []; return Object.keys(t.a).forEach(function (e) { r.push(e + "=" + t.a[e]); }), t.c + "{" + e.join(",") + (r.length > 0 ? "," : "") + r.join(",") + "}"; };
        r.gtsToPath = function (t) { var e = []; t.v = t.v.sort(function (t, e) { return t[0] - e[0]; }); for (var r_4 = 0; r_4 < t.v.length; r_4++) {
            var s_2 = t.v[r_4];
            s_2.length, s_2.length, 4 === s_2.length && e.push({ ts: Math.floor(s_2[0] / 1e3), lat: s_2[1], lon: s_2[2], val: s_2[3] }), 5 === s_2.length && e.push({ ts: Math.floor(s_2[0] / 1e3), lat: s_2[1], lon: s_2[2], elev: s_2[3], val: s_2[4] });
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
        r.getDivider = function (t) { var e = 1e3; return "ms" === t && (e = 1), "ns" === t && (e = 1e6), e; };
        return r;
    }());  var s; !function (t) { t[t.DEBUG = 0] = "DEBUG", t[t.ERROR = 1] = "ERROR", t[t.WARN = 2] = "WARN", t[t.INFO = 3] = "INFO"; }(s || (s = {}));
    var n = /** @class */ (function () {
        function n() {
        }
        n.guid = function () { var t, e, r = ""; for (t = 0; t < 32; t++)
            e = 16 * Math.random() | 0, 8 != t && 12 != t && 16 != t && 20 != t || (r += "-"), r += (12 == t ? 4 : 16 == t ? 3 & e | 8 : e).toString(16); return r; };
        n.mergeDeep = function () {
            var t = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                t[_i] = arguments[_i];
            }
            var e = {}, r = 0;
            for (; r < arguments.length; r++) {
                var t_1 = arguments[r];
                n.merge(t_1, e, !0);
            }
            return e;
        };
        n.merge = function (t, e, r) { for (var s_3 in t)
            t.hasOwnProperty(s_3) && (r && "[object Object]" === Object.prototype.toString.call(t[s_3]) ? e[s_3] = n.mergeDeep(e[s_3], t[s_3]) : e[s_3] = t[s_3]); };
        n.isObject = function (t) { return t && "object" == typeof t && !Array.isArray(t); };
        n.getTooltipCallbacks = function () { return { title: function (t) { return t[0].xLabel; }, label: function (t, e) { var r = e.datasets[t.datasetIndex].label || ""; return r && (r += ": "), r + t.yLabel; } }; };
        n.buildImage = function (t, e, r) { var s = new Image(t, e), n = "<svg width=\"" + t + "px\" height=\"" + e + "px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 " + t + " " + e + "\" preserveAspectRatio=\"xMidYMid\">\n<rect width=\"" + t + "\" height=\"" + e + "\" style=\"fill:" + r + ";\" />\n</svg>"; return s.src = "data:image/svg+xml;base64," + btoa(n), s; };
        return n;
    }());  t.GTSLib = r, t.Logger = /** @class */ (function () {
    function Logger(t) {
        this.className = t.name;
    }
    Logger.prototype.log = function (t, e, r) { var n = "[" + this.className + "] " + e.join(" - "); switch (t) {
        case s.DEBUG: break;
        case s.ERROR:
            console.error(n, r);
            break;
        case s.INFO:
            console.log(n, r);
            break;
        case s.WARN:
            console.warn(n, r);
            break;
        default: console.log(n, r);
    } };
    Logger.prototype.debug = function (t, e) { this.log(s.DEBUG, t, e); };
    Logger.prototype.error = function (t, e) { this.log(s.ERROR, t, e); };
    Logger.prototype.warn = function (t, e) { this.log(s.WARN, t, e); };
    Logger.prototype.info = function (t, e) { this.log(s.INFO, t, e); };
    return Logger;
}()), t.Param = /** @class */ (function () {
    function Param() {
        this.timeUnit = "us";
    }
    return Param;
}()), t.ChartLib = n, t.DataModel = e; });
