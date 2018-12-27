/*! Built with http://stenciljs.com */
warpview.loadBundle("chunk-c74fdde1.js", ["exports"], function (t) { window.warpview.h;
    var e = /** @class */ (function () {
        function e() {
        }
        return e;
    }()); 
    var s = /** @class */ (function () {
        function s(t) {
            this.className = t.name;
        }
        s.isArray = function (t) { return t && "object" == typeof t && t instanceof Array && "number" == typeof t.length && "function" == typeof t.splice && !t.propertyIsEnumerable("length"); };
        s.prototype.log = function (t, e, s) { var n = []; switch ((n.push("[" + this.className + "] " + e.join(" - ")), n = n.concat(s), t)) {
            case r.DEBUG: break;
            case r.ERROR:
                console.error.apply(console, n);
                break;
            case r.INFO:
                console.log.apply(console, n);
                break;
            case r.WARN:
                console.warn.apply(console, n);
                break;
            default: console.log.apply(console, n);
        } };
        s.prototype.debug = function (t) {
            var e = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                e[_i - 1] = arguments[_i];
            }
            this.log(r.DEBUG, t, e);
        };
        s.prototype.error = function (t) {
            var e = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                e[_i - 1] = arguments[_i];
            }
            this.log(r.ERROR, t, e);
        };
        s.prototype.warn = function (t) {
            var e = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                e[_i - 1] = arguments[_i];
            }
            this.log(r.WARN, t, e);
        };
        s.prototype.info = function (t) {
            var e = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                e[_i - 1] = arguments[_i];
            }
            this.log(r.INFO, t, e);
        };
        return s;
    }());  var r; !function (t) { t[t.DEBUG = 0] = "DEBUG", t[t.ERROR = 1] = "ERROR", t[t.WARN = 2] = "WARN", t[t.INFO = 3] = "INFO"; }(r || (r = {}));
    var n = /** @class */ (function () {
        function n() {
        }
        n.cleanArray = function (t) { return t.filter(function (t) { return !!t; }); };
        n.unique = function (t) { var e = {}, s = []; for (var r_1 = 0, n_1 = t.length; r_1 < n_1; ++r_1)
            e.hasOwnProperty(t[r_1]) || (s.push(t[r_1]), e[t[r_1]] = 1); return s; };
        n.isArray = function (t) { return t && "object" == typeof t && t instanceof Array && "number" == typeof t.length && "function" == typeof t.splice && !t.propertyIsEnumerable("length"); };
        n.isValidResponse = function (t) { var e; try {
            e = JSON.parse(t);
        }
        catch (e) {
            return this.LOG.error(["isValidResponse"], "Response non JSON compliant", t), !1;
        } return !!n.isArray(e) || (this.LOG.error(["isValidResponse"], "Response isn't an Array", e), !1); };
        n.isEmbeddedImage = function (t) { return !("string" != typeof t || !/^data:image/.test(t)); };
        n.isEmbeddedImageObject = function (t) { return !(null === t || null === t.image || null === t.caption || !n.isEmbeddedImage(t.image)); };
        n.isPositionArray = function (t) { if (!t || !t.positions)
            return !1; if (n.isPositionsArrayWithValues(t) || n.isPositionsArrayWithTwoValues(t))
            return !0; for (var e_1 in t.positions) {
            if (t.positions[e_1].length < 2 || t.positions[e_1].length > 3)
                return !1;
            for (var s_1 in t.positions[e_1])
                if ("number" != typeof t.positions[e_1][s_1])
                    return !1;
        } return !0; };
        n.isPositionsArrayWithValues = function (t) { if (null === t || null === t.positions)
            return !1; for (var e_2 in t.positions) {
            if (3 !== t.positions[e_2].length)
                return !1;
            for (var s_2 in t.positions[e_2])
                if ("number" != typeof t.positions[e_2][s_2])
                    return !1;
        } return !0; };
        n.isPositionsArrayWithTwoValues = function (t) { if (null === t || null === t.positions)
            return !1; for (var e_3 in t.positions) {
            if (4 !== t.positions[e_3].length)
                return !1;
            for (var s_3 in t.positions[e_3])
                if ("number" != typeof t.positions[e_3][s_3])
                    return !1;
        } return !0; };
        n.metricFromJSON = function (t) { var e = { ts: t[0], value: void 0, alt: void 0, lon: void 0, lat: void 0 }; switch (t.length) {
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
        n.gtsFromJSON = function (t, e) { return { gts: { c: t.c, l: t.l, a: t.a, v: t.v, id: e } }; };
        n.gtsFromJSONList = function (t, e) { var s, r = []; return (t || []).forEach(function (t, a) { var i = t; t.gts && (i = t.gts), s = void 0 !== e && "" !== e ? e + "-" + a : a, n.isArray(i) && r.push(n.gtsFromJSONList(i, s)), n.isGts(i) && r.push(n.gtsFromJSON(i, s)), n.isEmbeddedImage(i) && r.push({ image: i, caption: "Image", id: s }), n.isEmbeddedImageObject(i) && r.push({ image: i.image, caption: i.caption, id: s }); }), { content: r || [] }; };
        n.flatDeep = function (t) { return n.isArray(t) || (t = [t]), t.reduce(function (t, e) { return Array.isArray(e) ? t.concat(n.flatDeep(e)) : t.concat(e); }, []); };
        n.flattenGtsIdArray = function (t, e) { var s = []; return n.isGts(t) && (t = [t]), t.forEach(function (t) { if (n.isArray(t)) {
            var r_2 = n.flattenGtsIdArray(t, e);
            s.push(r_2.res), e = r_2.r;
        }
        else
            t.v && (t.id = e, s.push(t), e++); }), { res: s, r: e }; };
        n.serializeGtsMetadata = function (t) { var e = []; Object.keys(t.l).forEach(function (s) { e.push(s + "=" + t.l[s]); }); var s = []; return Object.keys(t.a).forEach(function (e) { s.push(e + "=" + t.a[e]); }), t.c + "{" + e.join(",") + (s.length > 0 ? "," : "") + s.join(",") + "}"; };
        n.gtsToPath = function (t) { var e = []; for (var s_4 = 0; s_4 < t.v.length; s_4++) {
            var r_3 = t.v[s_4];
            r_3.length, r_3.length, 4 === r_3.length && e.push({ ts: Math.floor(r_3[0] / 1e3), lat: r_3[1], lon: r_3[2], val: r_3[3] }), 5 === r_3.length && e.push({ ts: Math.floor(r_3[0] / 1e3), lat: r_3[1], lon: r_3[2], elev: r_3[3], val: r_3[4] });
        } return e; };
        n.equalMetadata = function (t, e) { if (!(void 0 !== t.c && void 0 !== e.c && void 0 !== t.l && void 0 !== e.l && t.l instanceof Object && e.l instanceof Object))
            return this.LOG.error(["equalMetadata"], "Error in GTS, metadata is not well formed"), !1; if (t.c !== e.c)
            return !1; for (var s_5 in t.l)
            if (!e.l.hasOwnProperty(s_5) || t.l[s_5] !== e.l[s_5])
                return !1; for (var s_6 in e.l)
            if (!t.l.hasOwnProperty(s_6))
                return !1; return !0; };
        n.isGts = function (t) { return !(!t || null === t.c || null === t.l || null === t.a || null === t.v || !n.isArray(t.v)); };
        n.isGtsToPlot = function (t) { if (!n.isGts(t) || 0 === t.v.length)
            return !1; for (var e_4 = 0; e_4 < t.v.length; e_4++)
            if (null !== t.v[e_4][t.v[e_4].length - 1]) {
                if ("number" == typeof t.v[e_4][t.v[e_4].length - 1] || void 0 !== t.v[e_4][t.v[e_4].length - 1].constructor.prototype.toFixed)
                    return !0;
                break;
            } return !1; };
        n.isBooleanGts = function (t) { if (!n.isGts(t) || 0 === t.v.length)
            return !1; for (var e_5 = 0; e_5 < t.v.length; e_5++)
            if (null !== t.v[e_5][t.v[e_5].length - 1]) {
                if ("boolean" != typeof t.v[e_5][t.v[e_5].length - 1])
                    return !0;
                break;
            } return !1; };
        n.isGtsToAnnotate = function (t) { if (!n.isGts(t) || 0 === t.v.length)
            return !1; for (var e_6 = 0; e_6 < t.v.length; e_6++)
            if (null !== t.v[e_6][t.v[e_6].length - 1]) {
                if ("number" != typeof t.v[e_6][t.v[e_6].length - 1] && t.v[e_6][t.v[e_6].length - 1].constructor && "Big" !== t.v[e_6][t.v[e_6].length - 1].constructor.name && void 0 === t.v[e_6][t.v[e_6].length - 1].constructor.prototype.toFixed)
                    return !0;
                break;
            } return !1; };
        n.gtsSort = function (t) { t.isSorted || (t.v = t.v.sort(function (t, e) { return t[0] - e[0]; }), t.isSorted = !0); };
        n.gtsTimeRange = function (t) { return n.gtsSort(t), 0 === t.v.length ? null : [t.v[0][0], t.v[t.v.length - 1][0]]; };
        n.getData = function (t) { return "string" == typeof t ? n.getData(JSON.parse(t)) : t && t.hasOwnProperty("data") ? t : n.isArray(t) && t.length > 0 && t[0].data ? t[0] : n.isArray(t) ? { data: t } : new e; };
        n.getDivider = function (t) { var e = 1e3; return "ms" === t && (e = 1), "ns" === t && (e = 1e6), e; };
        return n;
    }());  n.LOG = new s(n), n.formatLabel = (function (t) { var e = t.split("{"); var s = "<span class=\"gtsInfo\"><span class='gts-classname'>" + e[0] + "</span>"; if (e.length > 1) {
    s += "<span class='gts-separator'>{</span>";
    var t_1 = e[1].substr(0, e[1].length - 1).split(",");
    t_1.length > 0 && t_1.forEach(function (e, r) { var n = e.split("="); e.length > 1 && (s += "<span><span class='gts-labelname'>" + n[0] + "</span><span class='gts-separator'>=</span><span class='gts-labelvalue'>" + n[1] + "</span>", r !== t_1.length - 1 && (s += "<span>, </span>")); }), s += "<span class='gts-separator'>}</span>";
} if (e.length > 2) {
    s += "<span class='gts-separator'>{</span>";
    var t_2 = e[2].substr(0, e[2].length - 1).split(",");
    t_2.length > 0 && t_2.forEach(function (e, r) { var n = e.split("="); e.length > 1 && (s += "<span><span class='gts-attrname'>" + n[0] + "</span><span class='gts-separator'>=</span><span class='gts-attrvalue'>" + n[1] + "</span>", r !== t_2.length - 1 && (s += "<span>, </span>")); }), s += "<span class='gts-separator'>}</span>";
} return s += "</span>"; }), t.GTSLib = n, t.Logger = s, t.DataModel = e; });
