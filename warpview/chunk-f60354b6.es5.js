/*! Built with http://stenciljs.com */
warpview.loadBundle("chunk-f60354b6.js", ["exports"], function (t) { window.warpview.h;
    var s = /** @class */ (function () {
        function s() {
        }
        return s;
    }()); 
    var e = /** @class */ (function () {
        function e() {
        }
        e.cleanArray = function (t) { return t.filter(function (t) { return !!t; }); };
        e.unique = function (t) { var s = {}, e = []; for (var r = 0, n = t.length; r < n; ++r)
            s.hasOwnProperty(t[r]) || (e.push(t[r]), s[t[r]] = 1); return e; };
        e.isArray = function (t) { return t && "object" == typeof t && t instanceof Array && "number" == typeof t.length && "function" == typeof t.splice && !t.propertyIsEnumerable("length"); };
        e.isValidResponse = function (t) { var s; try {
            s = JSON.parse(t);
        }
        catch (s) {
            return console.error("Response non JSON compliant", t), !1;
        } return !!e.isArray(s) || (console.error("Response isn't an Array", s), !1); };
        e.isEmbeddedImage = function (t) { return !("string" != typeof t || !/^data:image/.test(t)); };
        e.isEmbeddedImageObject = function (t) { return !(null === t || null === t.image || null === t.caption || !e.isEmbeddedImage(t.image)); };
        e.isPositionArray = function (t) { if (!t || !t.positions)
            return !1; if (e.isPositionsArrayWithValues(t) || e.isPositionsArrayWithTwoValues(t))
            return !0; for (var s_1 in t.positions) {
            if (t.positions[s_1].length < 2 || t.positions[s_1].length > 3)
                return !1;
            for (var e_1 in t.positions[s_1])
                if ("number" != typeof t.positions[s_1][e_1])
                    return !1;
        } return !0; };
        e.isPositionsArrayWithValues = function (t) { if (null === t || null === t.positions)
            return !1; for (var s_2 in t.positions) {
            if (3 !== t.positions[s_2].length)
                return !1;
            for (var e_2 in t.positions[s_2])
                if ("number" != typeof t.positions[s_2][e_2])
                    return !1;
        } return !0; };
        e.isPositionsArrayWithTwoValues = function (t) { if (null === t || null === t.positions)
            return !1; for (var s_3 in t.positions) {
            if (4 !== t.positions[s_3].length)
                return !1;
            for (var e_3 in t.positions[s_3])
                if ("number" != typeof t.positions[s_3][e_3])
                    return !1;
        } return !0; };
        e.metricFromJSON = function (t) { var s = { ts: t[0], value: void 0, alt: void 0, lon: void 0, lat: void 0 }; switch (t.length) {
            case 2:
                s.value = t[1];
                break;
            case 3:
                s.alt = t[1], s.value = t[2];
                break;
            case 4:
                s.lat = t[1], s.lon = t[2], s.value = t[3];
                break;
            case 5: s.lat = t[1], s.lon = t[2], s.alt = t[3], s.value = t[4];
        } return s; };
        e.gtsFromJSON = function (t, s) { return { gts: { c: t.c, l: t.l, a: t.a, v: t.v, id: s } }; };
        e.gtsFromJSONList = function (t, s) { var r, n = []; return (t || []).forEach(function (t, a) { var l = t; t.gts && (l = t.gts), r = void 0 !== s && "" !== s ? s + "-" + a : a, e.isArray(l) && n.push(e.gtsFromJSONList(l, r)), e.isGts(l) && n.push(e.gtsFromJSON(l, r)), e.isEmbeddedImage(l) && n.push({ image: l, caption: "Image", id: r }), e.isEmbeddedImageObject(l) && n.push({ image: l.image, caption: l.caption, id: r }); }), { content: n || [] }; };
        e.flatDeep = function (t) { return e.isArray(t) || (t = [t]), t.reduce(function (t, s) { return Array.isArray(s) ? t.concat(e.flatDeep(s)) : t.concat(s); }, []); };
        e.flattenGtsIdArray = function (t, s) { var r = []; return console.log("flattenGtsIdArray", t, s), e.isGts(t) && (t = [t]), t.forEach(function (t) { if (console.log("flattenGtsIdArray a.forEach", t, s), e.isArray(t)) {
            console.log("flattenGtsIdArray d isArray");
            var n = e.flattenGtsIdArray(t, s);
            r.push(n.res), s = n.r;
        }
        else
            t.v && (t.id = s, r.push(t), s++); console.log("flattenGtsIdArray res r", r, s); }), console.log("flattenGtsIdArray res", r), { res: r, r: s }; };
        e.serializeGtsMetadata = function (t) { var s = []; Object.keys(t.l).forEach(function (e) { s.push(e + "=" + t.l[e]); }); var e = []; return Object.keys(t.a).forEach(function (s) { e.push(s + "=" + t.a[s]); }), t.c + "{" + s.join(",") + (e.length > 0 ? "," : "") + e.join(",") + "}"; };
        e.gtsToPath = function (t) { var s = []; for (var e_4 = 0; e_4 < t.v.length; e_4++) {
            var r = t.v[e_4];
            r.length, r.length, 4 === r.length && s.push({ ts: Math.floor(r[0] / 1e3), lat: r[1], lon: r[2], val: r[3] }), 5 === r.length && s.push({ ts: Math.floor(r[0] / 1e3), lat: r[1], lon: r[2], elev: r[3], val: r[4] });
        } return s; };
        e.equalMetadata = function (t, s) { if (!(void 0 !== t.c && void 0 !== s.c && void 0 !== t.l && void 0 !== s.l && t.l instanceof Object && s.l instanceof Object))
            return console.error("[warp10-gts-tools] equalMetadata - Error in GTS, metadata is not well formed"), !1; if (t.c !== s.c)
            return !1; for (var e_5 in t.l)
            if (!s.l.hasOwnProperty(e_5) || t.l[e_5] !== s.l[e_5])
                return !1; for (var e_6 in s.l)
            if (!t.l.hasOwnProperty(e_6))
                return !1; return !0; };
        e.isGts = function (t) { return !(!t || null === t.c || null === t.l || null === t.a || null === t.v || !e.isArray(t.v)); };
        e.isGtsToPlot = function (t) { if (!e.isGts(t) || 0 === t.v.length)
            return !1; for (var s_4 = 0; s_4 < t.v.length; s_4++)
            if (null !== t.v[s_4][t.v[s_4].length - 1]) {
                if ("number" == typeof t.v[s_4][t.v[s_4].length - 1] || void 0 !== t.v[s_4][t.v[s_4].length - 1].constructor.prototype.toFixed)
                    return !0;
                break;
            } return !1; };
        e.isBooleanGts = function (t) { if (!e.isGts(t) || 0 === t.v.length)
            return !1; for (var s_5 = 0; s_5 < t.v.length; s_5++)
            if (null !== t.v[s_5][t.v[s_5].length - 1]) {
                if ("boolean" != typeof t.v[s_5][t.v[s_5].length - 1])
                    return !0;
                break;
            } return !1; };
        e.isGtsToAnnotate = function (t) { if (!e.isGts(t) || 0 === t.v.length)
            return !1; for (var s_6 = 0; s_6 < t.v.length; s_6++)
            if (null !== t.v[s_6][t.v[s_6].length - 1]) {
                if ("number" != typeof t.v[s_6][t.v[s_6].length - 1] && t.v[s_6][t.v[s_6].length - 1].constructor && "Big" !== t.v[s_6][t.v[s_6].length - 1].constructor.name && void 0 === t.v[s_6][t.v[s_6].length - 1].constructor.prototype.toFixed)
                    return !0;
                break;
            } return !1; };
        e.gtsSort = function (t) { t.isSorted || (t.v = t.v.sort(function (t, s) { return t[0] - s[0]; }), t.isSorted = !0); };
        e.gtsTimeRange = function (t) { return e.gtsSort(t), 0 === t.v.length ? null : [t.v[0][0], t.v[t.v.length - 1][0]]; };
        e.getData = function (t) { return "string" == typeof t ? e.getData(JSON.parse(t)) : t && t.hasOwnProperty("data") ? t : e.isArray(t) && t.length > 0 && t[0].data ? t[0] : e.isArray(t) ? { data: t } : new s; };
        e.getDivider = function (t) { var s = 1e3; return "ms" === t && (s = 1), "ns" === t && (s = 1e6), s; };
        return e;
    }());  e.formatLabel = (function (t) { var s = t.split("{"); var e = "<span class=\"gtsInfo\"><span class='gts-classname'>" + s[0] + "</span>"; if (s.length > 1) {
    e += "<span class='gts-separator'>{</span>";
    var t_1 = s[1].substr(0, s[1].length - 1).split(",");
    t_1.length > 0 && t_1.forEach(function (s, r) { var n = s.split("="); s.length > 1 && (e += "<span><span class='gts-labelname'>" + n[0] + "</span><span class='gts-separator'>=</span><span class='gts-labelvalue'>" + n[1] + "</span>", r !== t_1.length - 1 && (e += "<span>, </span>")); }), e += "<span class='gts-separator'>}</span>";
} if (s.length > 2) {
    e += "<span class='gts-separator'>{</span>";
    var t_2 = s[2].substr(0, s[2].length - 1).split(",");
    t_2.length > 0 && t_2.forEach(function (s, r) { var n = s.split("="); s.length > 1 && (e += "<span><span class='gts-attrname'>" + n[0] + "</span><span class='gts-separator'>=</span><span class='gts-attrvalue'>" + n[1] + "</span>", r !== t_2.length - 1 && (e += "<span>, </span>")); }), e += "<span class='gts-separator'>}</span>";
} return e += "</span>"; }), t.GTSLib = e, t.DataModel = s; });
