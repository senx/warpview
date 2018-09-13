/*! Built with http://stenciljs.com */
quantumviz.loadBundle("chunk-47f4222f.js", ["exports"], function (t) { window.quantumviz.h;
    var e = /** @class */ (function () {
        function e() {
        }
        e.cleanArray = function (t) { return t.filter(function (t) { return !!t; }); };
        e.unique = function (t) { var e = {}, r = []; for (var n = 0, i = t.length; n < i; ++n)
            e.hasOwnProperty(t[n]) || (r.push(t[n]), e[t[n]] = 1); return r; };
        e.isArray = function (t) { return t && "object" == typeof t && t instanceof Array && "number" == typeof t.length && "function" == typeof t.splice && !t.propertyIsEnumerable("length"); };
        e.isValidResponse = function (t) { var r; try {
            r = JSON.parse(t);
        }
        catch (e) {
            return console.error("Response non JSON compliant", t), !1;
        } return !!e.isArray(r) || (console.error("Response isn't an Array", r), !1); };
        e.isEmbeddedImage = function (t) { return !("string" != typeof t || !/^data:image/.test(t)); };
        e.isEmbeddedImageObject = function (t) { return !(null === t || null === t.image || null === t.caption || !e.isEmbeddedImage(t.image)); };
        e.isPositionArray = function (t) { if (!t || !t.positions)
            return !1; if (e.isPositionsArrayWithValues(t) || e.isPositionsArrayWithTwoValues(t))
            return !0; for (var e_1 in t.positions) {
            if (t.positions[e_1].length < 2 || t.positions[e_1].length > 3)
                return !1;
            for (var r in t.positions[e_1])
                if ("number" != typeof t.positions[e_1][r])
                    return !1;
        } return !0; };
        e.isPositionsArrayWithValues = function (t) { if (null === t || null === t.positions)
            return !1; for (var e_2 in t.positions) {
            if (3 !== t.positions[e_2].length)
                return !1;
            for (var r in t.positions[e_2])
                if ("number" != typeof t.positions[e_2][r])
                    return !1;
        } return !0; };
        e.isPositionsArrayWithTwoValues = function (t) { if (null === t || null === t.positions)
            return !1; for (var e_3 in t.positions) {
            if (4 !== t.positions[e_3].length)
                return !1;
            for (var r in t.positions[e_3])
                if ("number" != typeof t.positions[e_3][r])
                    return !1;
        } return !0; };
        e.metricFromJSON = function (t) { var e = { ts: t[0], value: void 0, alt: void 0, lon: void 0, lat: void 0 }; switch (t.length) {
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
        e.gtsFromJSON = function (t, e) { return { gts: { c: t.c, l: t.l, a: t.a, v: t.v, id: e } }; };
        e.gtsFromJSONList = function (t, r) { var n, i = []; return t.forEach(function (t, s) { var o = t; t.gts && (o = t.gts), n = void 0 !== r && "" !== r ? r + "-" + s : s, e.isArray(o) && i.push(e.gtsFromJSONList(o, n)), e.isGts(o) && i.push(e.gtsFromJSON(o, n)), e.isEmbeddedImage(o) && i.push({ image: o, caption: "Image", id: n }), e.isEmbeddedImageObject(o) && i.push({ image: o.image, caption: o.caption, id: n }); }), { content: i }; };
        e.flatDeep = function (t) { return t.reduce(function (t, r) { return Array.isArray(r) ? t.concat(e.flatDeep(r)) : t.concat(r); }, []); };
        e.flattenGtsIdArray = function (t, r) { var n, i; for (r || (r = []), i = 0; i < t.content.length; i++)
            (n = t.content[i]).content ? e.flattenGtsIdArray(n, r) : n.gts && r.push(n.gts); return r; };
        e.serializeGtsMetadata = function (t) { var e = []; return Object.keys(t.l).forEach(function (r) { e.push(r + "=" + t.l[r]); }), t.c + "{" + e.join(",") + "}"; };
        e.gtsToPath = function (t) { var e = []; t.v = t.v.sort(function (t, e) { return t[0] - e[0]; }); for (var r = 0; r < t.v.length; r++) {
            var n = t.v[r];
            n.length, n.length, 4 === n.length && e.push({ ts: Math.floor(n[0] / 1e3), lat: n[1], lon: n[2], val: n[3] }), 5 === n.length && e.push({ ts: Math.floor(n[0] / 1e3), lat: n[1], lon: n[2], elev: n[3], val: n[4] });
        } return e; };
        e.equalMetadata = function (t, e) { if (!(void 0 !== t.c && void 0 !== e.c && void 0 !== t.l && void 0 !== e.l && t.l instanceof Object && e.l instanceof Object))
            return console.error("[warp10-gts-tools] equalMetadata - Error in GTS, metadata is not well formed"), !1; if (t.c !== e.c)
            return !1; for (var r in t.l) {
            if (!e.l.hasOwnProperty(r))
                return !1;
            if (t.l[r] !== e.l[r])
                return !1;
        } for (var r in e.l)
            if (!t.l.hasOwnProperty(r))
                return !1; return !0; };
        e.isGts = function (t) { return !(!t || null === t || null === t.c || null === t.l || null === t.a || null === t.v || !e.isArray(t.v)); };
        e.isGtsToPlot = function (t) { if (!e.isGts(t) || 0 === t.v.length)
            return !1; for (var e_4 = 0; e_4 < t.v.length; e_4++)
            if (null !== t.v[e_4][t.v[e_4].length - 1]) {
                if ("number" == typeof t.v[e_4][t.v[e_4].length - 1] || void 0 !== t.v[e_4][t.v[e_4].length - 1].constructor.prototype.toFixed)
                    return !0;
                break;
            } return !1; };
        e.isBooleanGts = function (t) { if (!e.isGts(t) || 0 === t.v.length)
            return !1; for (var e_5 = 0; e_5 < t.v.length; e_5++)
            if (null !== t.v[e_5][t.v[e_5].length - 1]) {
                if ("boolean" != typeof t.v[e_5][t.v[e_5].length - 1])
                    return !0;
                break;
            } return !1; };
        e.isGtsToAnnotate = function (t) { if (!e.isGts(t) || 0 === t.v.length)
            return !1; for (var e_6 = 0; e_6 < t.v.length; e_6++)
            if (null !== t.v[e_6][t.v[e_6].length - 1]) {
                if ("number" != typeof t.v[e_6][t.v[e_6].length - 1] && t.v[e_6][t.v[e_6].length - 1].constructor && "Big" !== t.v[e_6][t.v[e_6].length - 1].constructor.name && void 0 === t.v[e_6][t.v[e_6].length - 1].constructor.prototype.toFixed)
                    return !0;
                break;
            } return !1; };
        e.gtsSort = function (t) { t.isSorted || (t.v = t.v.sort(function (t, e) { return t[0] - e[0]; }), t.isSorted = !0); };
        e.gtsTimeRange = function (t) { return e.gtsSort(t), 0 === t.v.length ? null : [t.v[0][0], t.v[t.v.length - 1][0]]; };
        return e;
    }());  t.GTSLib = e; });
