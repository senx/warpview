/*! Built with http://stenciljs.com */
warpview.loadBundle("chunk-61a8d122.js", ["exports"], function (t) { window.warpview.h;
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
        r.gtsFromJSONList = function (t, e) { var s, n = []; return (t || []).forEach(function (t, o) { var a = t; t.gts && (a = t.gts), s = void 0 !== e && "" !== e ? e + "-" + o : o, r.isArray(a) && n.push(r.gtsFromJSONList(a, s)), r.isGts(a) && n.push(r.gtsFromJSON(a, s)), r.isEmbeddedImage(a) && n.push({ image: a, caption: "Image", id: s }), r.isEmbeddedImageObject(a) && n.push({ image: a.image, caption: a.caption, id: s }); }), { content: n || [] }; };
        r.flatDeep = function (t) { return t.reduce(function (t, e) { return Array.isArray(e) ? t.concat(r.flatDeep(e)) : t.concat(e); }, []); };
        r.flattenGtsIdArray = function (t, e) { var s, n; for (e || (e = []), n = 0; n < t.content.length; n++)
            (s = t.content[n]).content ? r.flattenGtsIdArray(s, e) : s.gts && e.push(s.gts); return e; };
        r.serializeGtsMetadata = function (t) { var e = []; Object.keys(t.l).forEach(function (r) { e.push(r + "=" + t.l[r]); }); var r = []; return Object.keys(t.a).forEach(function (e) { r.push(e + "=" + t.a[e]); }), t.c + "{" + e.join(",") + r.join(",") + "}"; };
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
        r.getData = function (t) { return "string" == typeof t ? { data: JSON.parse(t) } : t && t.hasOwnProperty("data") ? t : r.isArray(t) ? { data: t } : new e; };
        return r;
    }()); 
    var s = /** @class */ (function () {
        function s() {
        }
        s.getColor = function (t) { return s.color[t % s.color.length]; };
        s.hexToRgb = function (t) { var e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t); return e ? [parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16)] : null; };
        s.transparentize = function (t, e) { return "rgba(" + s.hexToRgb(t).concat(e).join(",") + ")"; };
        s.generateColors = function (t) { var e = []; for (var r_7 = 0; r_7 < t; r_7++)
            e.push(s.getColor(r_7)); return e; };
        s.generateTransparentColors = function (t) { var e = []; for (var r_8 = 0; r_8 < t; r_8++)
            e.push(s.transparentize(s.getColor(r_8), .5)); return e; };
        s.hsvGradientFromRgbColors = function (t, e, r) { var n = s.rgb2hsv(t.r, t.g, t.b), o = s.rgb2hsv(e.r, e.g, e.b); t.h = n[0], t.s = n[1], t.v = n[2], e.h = o[0], e.s = o[1], e.v = o[2]; var a = s.hsvGradient(t, e, r); for (var t_1 in a)
            a[t_1] && (a[t_1].rgb = s.hsv2rgb(a[t_1].h, a[t_1].s, a[t_1].v), a[t_1].r = Math.floor(a[t_1].rgb[0]), a[t_1].g = Math.floor(a[t_1].rgb[1]), a[t_1].b = Math.floor(a[t_1].rgb[2])); return a; };
        s.rgb2hsv = function (t, e, r) { var s, n, o, a = t / 255, i = e / 255, l = r / 255, c = Math.max(a, i, l), u = c - Math.min(a, i, l); if (o = c, 0 === u)
            s = 0, n = 0;
        else
            switch (n = u / o, c) {
                case a:
                    s = (i - l + u * (i < l ? 6 : 0)) / 6 * u;
                    break;
                case i:
                    s = (l - a + 2 * u) / 6 * u;
                    break;
                case l: s = (a - i + 4 * u) / 6 * u;
            } return [s, n, o]; };
        s.hsvGradient = function (t, e, r) { var s = new Array(r), n = t.h >= e.h ? t.h - e.h : 1 + t.h - e.h, o = t.h >= e.h ? 1 + e.h - t.h : e.h - t.h; for (var a = 0; a < r; a++) {
            var i = o <= n ? t.h + o * a / (r - 1) : t.h - n * a / (r - 1);
            i < 0 && (i = 1 + i), i > 1 && (i -= 1);
            var l = (1 - a / (r - 1)) * t.s + a / (r - 1) * e.s, c = (1 - a / (r - 1)) * t.v + a / (r - 1) * e.v;
            s[a] = { h: i, s: l, v: c };
        } return s; };
        s.hsv2rgb = function (t, e, r) { var s, n, o, a = Math.floor(6 * t), i = 6 * t - a, l = r * (1 - e), c = r * (1 - i * e), u = r * (1 - (1 - i) * e); switch (a % 6) {
            case 0:
                s = r, n = u, o = l;
                break;
            case 1:
                s = c, n = r, o = l;
                break;
            case 2:
                s = l, n = r, o = u;
                break;
            case 3:
                s = l, n = c, o = r;
                break;
            case 4:
                s = u, n = l, o = r;
                break;
            case 5: s = r, n = l, o = c;
        } return [255 * s, 255 * n, 255 * o]; };
        s.rgb2hex = function (t, e, r) { function s(t) { var e = t.toString(16); return 1 === e.length ? "0" + e : e; } return "#" + s(t) + s(e) + s(r); };
        return s;
    }());  var n; s.color = ["#5899DA", "#E8743B", "#19A979", "#ED4A7B", "#945ECF", "#13A4B4", "#525DF4", "#BF399E", "#6C8893", "#EE6868", "#2F6497"], function (t) { t[t.DEBUG = 0] = "DEBUG", t[t.ERROR = 1] = "ERROR", t[t.WARN = 2] = "WARN", t[t.INFO = 3] = "INFO"; }(n || (n = {})), t.GTSLib = r, t.ColorLib = s, t.Logger = /** @class */ (function () {
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
}()), t.DataModel = e; });
