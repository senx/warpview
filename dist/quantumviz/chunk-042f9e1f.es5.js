/*! Built with http://stenciljs.com */
quantumviz.loadBundle("chunk-042f9e1f.js", ["exports"], function (t) { window.quantumviz.h;
    var e = /** @class */ (function () {
        function e() {
        }
        e.getColor = function (t) { return e.color[t % e.color.length]; };
        e.cleanArray = function (t) { var e = []; return t.forEach(function (t) { t && e.push(t); }), e; };
        e.unique = function (t) { var e = {}, r = []; for (var n = 0, i = t.length; n < i; ++n)
            e.hasOwnProperty(t[n]) || (r.push(t[n]), e[t[n]] = 1); return r; };
        e.hexToRgb = function (t) { var e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t); return e ? [parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16)] : null; };
        e.transparentize = function (t, r) { return "rgba(" + e.hexToRgb(t).concat(r).join(",") + ")"; };
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
        e.serializeGtsMetadata = function (t) { var e = []; return delete t.l.elm, Object.keys(t.l).forEach(function (r) { e.push(r + "=" + t.l[r]); }), (t.id ? t.id + " " : "") + t.c + "{" + e.join(",") + "}"; };
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
        e.isGtsToAnnotate = function (t) { if (!e.isGts(t) || 0 === t.v.length)
            return !1; for (var e_5 = 0; e_5 < t.v.length; e_5++)
            if (null !== t.v[e_5][t.v[e_5].length - 1]) {
                if ("number" != typeof t.v[e_5][t.v[e_5].length - 1] && t.v[e_5][t.v[e_5].length - 1].constructor && "Big" !== t.v[e_5][t.v[e_5].length - 1].constructor.name && void 0 === t.v[e_5][t.v[e_5].length - 1].constructor.prototype.toFixed)
                    return !0;
                break;
            } return !1; };
        e.gtsSort = function (t) { t.isSorted || (t.v = t.v.sort(function (t, e) { return t[0] - e[0]; }), t.isSorted = !0); };
        e.gtsTimeRange = function (t) { return e.gtsSort(t), 0 === t.v.length ? null : [t.v[0][0], t.v[t.v.length - 1][0]]; };
        e.guid = function () { var t, e, r = ""; for (t = 0; t < 32; t++)
            e = 16 * Math.random() | 0, 8 != t && 12 != t && 16 != t && 20 != t || (r += "-"), r += (12 == t ? 4 : 16 == t ? 3 & e | 8 : e).toString(16); return r; };
        e.mergeDeep = function (t) {
            var r = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                r[_i - 1] = arguments[_i];
            }
            var _a, _b;
            if (!r.length)
                return t;
            var n = r.shift();
            if (e.isObject(t) && e.isObject(n))
                for (var r_1 in n)
                    e.isObject(n[r_1]) ? (t[r_1] || Object.assign(t, (_a = {}, _a[r_1] = {}, _a)), e.mergeDeep(t[r_1], n[r_1])) : Object.assign(t, (_b = {}, _b[r_1] = n[r_1], _b));
            return e.mergeDeep.apply(e, [t].concat(r));
        };
        e.isObject = function (t) { return t && "object" == typeof t && !Array.isArray(t); };
        return e;
    }());  e.color = ["#4D4D4D", "#5DA5DA", "#FAA43A", "#60BD68", "#F17CB0", "#B2912F", "#B276B2", "#DECF3F", "#F15854", "#607D8B"], t.GTSLib = e; });
