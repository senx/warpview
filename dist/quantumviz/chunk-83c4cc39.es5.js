/*! Built with http://stenciljs.com */
quantumviz.loadBundle("chunk-83c4cc39.js", ["exports", "./chunk-87d66f99.js"], function (t, e) { window.quantumviz.h;
    var r = /** @class */ (function () {
        function r() {
        }
        return r;
    }()); 
    var n = /** @class */ (function () {
        function n() {
        }
        n.cleanArray = function (t) { return t.filter(function (t) { return !!t; }); };
        n.unique = function (t) { var e = {}, r = []; for (var n_1 = 0, i = t.length; n_1 < i; ++n_1)
            e.hasOwnProperty(t[n_1]) || (r.push(t[n_1]), e[t[n_1]] = 1); return r; };
        n.isArray = function (t) { return t && "object" == typeof t && t instanceof Array && "number" == typeof t.length && "function" == typeof t.splice && !t.propertyIsEnumerable("length"); };
        n.isValidResponse = function (t) { var e; try {
            e = JSON.parse(t);
        }
        catch (e) {
            return console.error("Response non JSON compliant", t), !1;
        } return !!n.isArray(e) || (console.error("Response isn't an Array", e), !1); };
        n.isEmbeddedImage = function (t) { return !("string" != typeof t || !/^data:image/.test(t)); };
        n.isEmbeddedImageObject = function (t) { return !(null === t || null === t.image || null === t.caption || !n.isEmbeddedImage(t.image)); };
        n.isPositionArray = function (t) { if (!t || !t.positions)
            return !1; if (n.isPositionsArrayWithValues(t) || n.isPositionsArrayWithTwoValues(t))
            return !0; for (var e_1 in t.positions) {
            if (t.positions[e_1].length < 2 || t.positions[e_1].length > 3)
                return !1;
            for (var r_1 in t.positions[e_1])
                if ("number" != typeof t.positions[e_1][r_1])
                    return !1;
        } return !0; };
        n.isPositionsArrayWithValues = function (t) { if (null === t || null === t.positions)
            return !1; for (var e_2 in t.positions) {
            if (3 !== t.positions[e_2].length)
                return !1;
            for (var r_2 in t.positions[e_2])
                if ("number" != typeof t.positions[e_2][r_2])
                    return !1;
        } return !0; };
        n.isPositionsArrayWithTwoValues = function (t) { if (null === t || null === t.positions)
            return !1; for (var e_3 in t.positions) {
            if (4 !== t.positions[e_3].length)
                return !1;
            for (var r_3 in t.positions[e_3])
                if ("number" != typeof t.positions[e_3][r_3])
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
        n.gtsFromJSONList = function (t, e) { var r, i = []; return (t || []).forEach(function (t, s) { var o = t; t.gts && (o = t.gts), r = void 0 !== e && "" !== e ? e + "-" + s : s, n.isArray(o) && i.push(n.gtsFromJSONList(o, r)), n.isGts(o) && i.push(n.gtsFromJSON(o, r)), n.isEmbeddedImage(o) && i.push({ image: o, caption: "Image", id: r }), n.isEmbeddedImageObject(o) && i.push({ image: o.image, caption: o.caption, id: r }); }), { content: i || [] }; };
        n.flatDeep = function (t) { return t.reduce(function (t, e) { return Array.isArray(e) ? t.concat(n.flatDeep(e)) : t.concat(e); }, []); };
        n.flattenGtsIdArray = function (t, e) { var r, i; for (e || (e = []), i = 0; i < t.content.length; i++)
            (r = t.content[i]).content ? n.flattenGtsIdArray(r, e) : r.gts && e.push(r.gts); return e; };
        n.serializeGtsMetadata = function (t) { var e = []; return Object.keys(t.l).forEach(function (r) { e.push(r + "=" + t.l[r]); }), t.c + "{" + e.join(",") + "}"; };
        n.gtsToPath = function (t) { var e = []; t.v = t.v.sort(function (t, e) { return t[0] - e[0]; }); for (var r_4 = 0; r_4 < t.v.length; r_4++) {
            var n_2 = t.v[r_4];
            n_2.length, n_2.length, 4 === n_2.length && e.push({ ts: Math.floor(n_2[0] / 1e3), lat: n_2[1], lon: n_2[2], val: n_2[3] }), 5 === n_2.length && e.push({ ts: Math.floor(n_2[0] / 1e3), lat: n_2[1], lon: n_2[2], elev: n_2[3], val: n_2[4] });
        } return e; };
        n.equalMetadata = function (t, e) { if (!(void 0 !== t.c && void 0 !== e.c && void 0 !== t.l && void 0 !== e.l && t.l instanceof Object && e.l instanceof Object))
            return console.error("[warp10-gts-tools] equalMetadata - Error in GTS, metadata is not well formed"), !1; if (t.c !== e.c)
            return !1; for (var r_5 in t.l) {
            if (!e.l.hasOwnProperty(r_5))
                return !1;
            if (t.l[r_5] !== e.l[r_5])
                return !1;
        } for (var r_6 in e.l)
            if (!t.l.hasOwnProperty(r_6))
                return !1; return !0; };
        n.isGts = function (t) { return !(!t || null === t || null === t.c || null === t.l || null === t.a || null === t.v || !n.isArray(t.v)); };
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
        n.getData = function (t) { return "string" == typeof t ? { data: JSON.parse(t) } : t && t.hasOwnProperty("data") ? t : n.isArray(t) ? { data: t } : new r; };
        return n;
    }());  n.LOG = new e.Logger(n), t.GTSLib = n, t.DataModel = r; });
