/*! Built with http://stenciljs.com */
warpview.loadBundle("chunk-804abc18.js", ["exports"], function (t) { window.warpview.h;
    var e = /** @class */ (function () {
        function e() {
        }
        return e;
    }()); 
    var s = /** @class */ (function () {
        function s() {
        }
        s.cleanArray = function (t) { return t.filter(function (t) { return !!t; }); };
        s.unique = function (t) { var e = {}, s = []; for (var r_1 = 0, a_1 = t.length; r_1 < a_1; ++r_1)
            e.hasOwnProperty(t[r_1]) || (s.push(t[r_1]), e[t[r_1]] = 1); return s; };
        s.isArray = function (t) { return t && "object" == typeof t && t instanceof Array && "number" == typeof t.length && "function" == typeof t.splice && !t.propertyIsEnumerable("length"); };
        s.isValidResponse = function (t) { var e; try {
            e = JSON.parse(t);
        }
        catch (e) {
            return console.error("Response non JSON compliant", t), !1;
        } return !!s.isArray(e) || (console.error("Response isn't an Array", e), !1); };
        s.isEmbeddedImage = function (t) { return !("string" != typeof t || !/^data:image/.test(t)); };
        s.isEmbeddedImageObject = function (t) { return !(null === t || null === t.image || null === t.caption || !s.isEmbeddedImage(t.image)); };
        s.isPositionArray = function (t) { if (!t || !t.positions)
            return !1; if (s.isPositionsArrayWithValues(t) || s.isPositionsArrayWithTwoValues(t))
            return !0; for (var e_1 in t.positions) {
            if (t.positions[e_1].length < 2 || t.positions[e_1].length > 3)
                return !1;
            for (var s_1 in t.positions[e_1])
                if ("number" != typeof t.positions[e_1][s_1])
                    return !1;
        } return !0; };
        s.isPositionsArrayWithValues = function (t) { if (null === t || null === t.positions)
            return !1; for (var e_2 in t.positions) {
            if (3 !== t.positions[e_2].length)
                return !1;
            for (var s_2 in t.positions[e_2])
                if ("number" != typeof t.positions[e_2][s_2])
                    return !1;
        } return !0; };
        s.isPositionsArrayWithTwoValues = function (t) { if (null === t || null === t.positions)
            return !1; for (var e_3 in t.positions) {
            if (4 !== t.positions[e_3].length)
                return !1;
            for (var s_3 in t.positions[e_3])
                if ("number" != typeof t.positions[e_3][s_3])
                    return !1;
        } return !0; };
        s.metricFromJSON = function (t) { var e = { ts: t[0], value: void 0, alt: void 0, lon: void 0, lat: void 0 }; switch (t.length) {
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
        s.gtsFromJSON = function (t, e) { return { gts: { c: t.c, l: t.l, a: t.a, v: t.v, id: e } }; };
        s.gtsFromJSONList = function (t, e) { var r, a = []; return (t || []).forEach(function (t, n) { var o = t; t.gts && (o = t.gts), r = void 0 !== e && "" !== e ? e + "-" + n : n, s.isArray(o) && a.push(s.gtsFromJSONList(o, r)), s.isGts(o) && a.push(s.gtsFromJSON(o, r)), s.isEmbeddedImage(o) && a.push({ image: o, caption: "Image", id: r }), s.isEmbeddedImageObject(o) && a.push({ image: o.image, caption: o.caption, id: r }); }), { content: a || [] }; };
        s.flatDeep = function (t) { return s.isArray(t) || (t = [t]), t.reduce(function (t, e) { return Array.isArray(e) ? t.concat(s.flatDeep(e)) : t.concat(e); }, []); };
        s.flattenGtsIdArray = function (t, e) { var r = []; return console.log("flattenGtsIdArray", t, e), s.isGts(t) && (t = [t]), t.forEach(function (t) { if (console.log("flattenGtsIdArray a.forEach", t, e), s.isArray(t)) {
            console.log("flattenGtsIdArray d isArray");
            var a_2 = s.flattenGtsIdArray(t, e);
            r.push(a_2.res), e = a_2.r;
        }
        else
            t.v && (t.id = e, r.push(t), e++); console.log("flattenGtsIdArray res r", r, e); }), console.log("flattenGtsIdArray res", r), { res: r, r: e }; };
        s.serializeGtsMetadata = function (t) { var e = []; Object.keys(t.l).forEach(function (s) { e.push(s + "=" + t.l[s]); }); var s = []; return Object.keys(t.a).forEach(function (e) { s.push(e + "=" + t.a[e]); }), t.c + "{" + e.join(",") + (s.length > 0 ? "," : "") + s.join(",") + "}"; };
        s.gtsToPath = function (t) { var e = []; for (var s_4 = 0; s_4 < t.v.length; s_4++) {
            var r_2 = t.v[s_4];
            r_2.length, r_2.length, 4 === r_2.length && e.push({ ts: Math.floor(r_2[0] / 1e3), lat: r_2[1], lon: r_2[2], val: r_2[3] }), 5 === r_2.length && e.push({ ts: Math.floor(r_2[0] / 1e3), lat: r_2[1], lon: r_2[2], elev: r_2[3], val: r_2[4] });
        } return e; };
        s.equalMetadata = function (t, e) { if (!(void 0 !== t.c && void 0 !== e.c && void 0 !== t.l && void 0 !== e.l && t.l instanceof Object && e.l instanceof Object))
            return console.error("[warp10-gts-tools] equalMetadata - Error in GTS, metadata is not well formed"), !1; if (t.c !== e.c)
            return !1; for (var s_5 in t.l)
            if (!e.l.hasOwnProperty(s_5) || t.l[s_5] !== e.l[s_5])
                return !1; for (var s_6 in e.l)
            if (!t.l.hasOwnProperty(s_6))
                return !1; return !0; };
        s.isGts = function (t) { return !(!t || null === t.c || null === t.l || null === t.a || null === t.v || !s.isArray(t.v)); };
        s.isGtsToPlot = function (t) { if (!s.isGts(t) || 0 === t.v.length)
            return !1; for (var e_4 = 0; e_4 < t.v.length; e_4++)
            if (null !== t.v[e_4][t.v[e_4].length - 1]) {
                if ("number" == typeof t.v[e_4][t.v[e_4].length - 1] || void 0 !== t.v[e_4][t.v[e_4].length - 1].constructor.prototype.toFixed)
                    return !0;
                break;
            } return !1; };
        s.isBooleanGts = function (t) { if (!s.isGts(t) || 0 === t.v.length)
            return !1; for (var e_5 = 0; e_5 < t.v.length; e_5++)
            if (null !== t.v[e_5][t.v[e_5].length - 1]) {
                if ("boolean" != typeof t.v[e_5][t.v[e_5].length - 1])
                    return !0;
                break;
            } return !1; };
        s.isGtsToAnnotate = function (t) { if (!s.isGts(t) || 0 === t.v.length)
            return !1; for (var e_6 = 0; e_6 < t.v.length; e_6++)
            if (null !== t.v[e_6][t.v[e_6].length - 1]) {
                if ("number" != typeof t.v[e_6][t.v[e_6].length - 1] && t.v[e_6][t.v[e_6].length - 1].constructor && "Big" !== t.v[e_6][t.v[e_6].length - 1].constructor.name && void 0 === t.v[e_6][t.v[e_6].length - 1].constructor.prototype.toFixed)
                    return !0;
                break;
            } return !1; };
        s.gtsSort = function (t) { t.isSorted || (t.v = t.v.sort(function (t, e) { return t[0] - e[0]; }), t.isSorted = !0); };
        s.gtsTimeRange = function (t) { return s.gtsSort(t), 0 === t.v.length ? null : [t.v[0][0], t.v[t.v.length - 1][0]]; };
        s.getData = function (t) { return "string" == typeof t ? s.getData(JSON.parse(t)) : t && t.hasOwnProperty("data") ? t : s.isArray(t) && t.length > 0 && t[0].data ? t[0] : s.isArray(t) ? { data: t } : new e; };
        s.getDivider = function (t) { var e = 1e3; return "ms" === t && (e = 1), "ns" === t && (e = 1e6), e; };
        return s;
    }());  var r; s.formatLabel = (function (t) { var e = t.split("{"); var s = "<span class=\"gtsInfo\"><span class='gts-classname'>" + e[0] + "</span>"; if (e.length > 1) {
    s += "<span class='gts-separator'>{</span>";
    var t_1 = e[1].substr(0, e[1].length - 1).split(",");
    t_1.length > 0 && t_1.forEach(function (e, r) { var a = e.split("="); e.length > 1 && (s += "<span><span class='gts-labelname'>" + a[0] + "</span><span class='gts-separator'>=</span><span class='gts-labelvalue'>" + a[1] + "</span>", r !== t_1.length - 1 && (s += "<span>, </span>")); }), s += "<span class='gts-separator'>}</span>";
} if (e.length > 2) {
    s += "<span class='gts-separator'>{</span>";
    var t_2 = e[2].substr(0, e[2].length - 1).split(",");
    t_2.length > 0 && t_2.forEach(function (e, r) { var a = e.split("="); e.length > 1 && (s += "<span><span class='gts-attrname'>" + a[0] + "</span><span class='gts-separator'>=</span><span class='gts-attrvalue'>" + a[1] + "</span>", r !== t_2.length - 1 && (s += "<span>, </span>")); }), s += "<span class='gts-separator'>}</span>";
} return s += "</span>"; }), function (t) { t[t.DEBUG = 0] = "DEBUG", t[t.ERROR = 1] = "ERROR", t[t.WARN = 2] = "WARN", t[t.INFO = 3] = "INFO"; }(r || (r = {}));
    var a = /** @class */ (function () {
        function a() {
        }
        a.guid = function () { var t, e, s = ""; for (t = 0; t < 32; t++)
            e = 16 * Math.random() | 0, 8 != t && 12 != t && 16 != t && 20 != t || (s += "-"), s += (12 == t ? 4 : 16 == t ? 3 & e | 8 : e).toString(16); return s; };
        a.mergeDeep = function () {
            var t = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                t[_i] = arguments[_i];
            }
            var e = {}, s = 0;
            for (; s < arguments.length; s++) {
                var t_3 = arguments[s];
                a.merge(t_3, e, !0);
            }
            return e;
        };
        a.merge = function (t, e, s) { for (var r_3 in t)
            t.hasOwnProperty(r_3) && (s && "[object Object]" === Object.prototype.toString.call(t[r_3]) ? e[r_3] = a.mergeDeep(e[r_3], t[r_3]) : e[r_3] = t[r_3]); };
        a.isObject = function (t) { return t && "object" == typeof t && !Array.isArray(t); };
        a.getTooltipCallbacks = function () { return { title: function (t) { return t[0].xLabel; }, label: function (t, e) { var s = e.datasets[t.datasetIndex].label || ""; return s && (s += ": "), s + t.yLabel; } }; };
        a.buildImage = function (t, e, s) { var r = new Image(t, e), a = "<svg width=\"" + t + "px\" height=\"" + e + "px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 " + t + " " + e + "\" preserveAspectRatio=\"xMidYMid\">\n<rect width=\"" + t + "\" height=\"" + e + "\" style=\"fill:" + s + ";\" ></rect>\n</svg>"; return r.src = "data:image/svg+xml;base64," + btoa(a), r; };
        return a;
    }());  t.GTSLib = s, t.Logger = /** @class */ (function () {
    function Logger(t) {
        this.className = t.name;
    }
    Logger.isArray = function (t) { return t && "object" == typeof t && t instanceof Array && "number" == typeof t.length && "function" == typeof t.splice && !t.propertyIsEnumerable("length"); };
    Logger.prototype.log = function (t, e, s) { var a = []; switch ((a.push("[" + this.className + "] " + e.join(" - ")), a = a.concat(s), t)) {
        case r.DEBUG: break;
        case r.ERROR:
            console.error.apply(console, a);
            break;
        case r.INFO:
            console.log.apply(console, a);
            break;
        case r.WARN:
            console.warn.apply(console, a);
            break;
        default: console.log.apply(console, a);
    } };
    Logger.prototype.debug = function (t) {
        var e = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            e[_i - 1] = arguments[_i];
        }
        this.log(r.DEBUG, t, e);
    };
    Logger.prototype.error = function (t) {
        var e = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            e[_i - 1] = arguments[_i];
        }
        this.log(r.ERROR, t, e);
    };
    Logger.prototype.warn = function (t) {
        var e = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            e[_i - 1] = arguments[_i];
        }
        this.log(r.WARN, t, e);
    };
    Logger.prototype.info = function (t) {
        var e = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            e[_i - 1] = arguments[_i];
        }
        this.log(r.INFO, t, e);
    };
    return Logger;
}()), t.Param = /** @class */ (function () {
    function Param() {
        this.showDots = !0, this.timeUnit = "us";
    }
    return Param;
}()), t.ChartLib = a, t.DataModel = e; });
