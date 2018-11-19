/*! Built with http://stenciljs.com */
warpview.loadBundle("chunk-a7af8df8.js", ["exports"], function (r) { window.warpview.h;
    var t = /** @class */ (function () {
        function t() {
        }
        t.getColor = function (r) { return t.color[r % t.color.length]; };
        t.hexToRgb = function (r) { var t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(r); return t ? [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)] : null; };
        t.transparentize = function (r, e) { return "rgba(" + t.hexToRgb(r).concat(e).join(",") + ")"; };
        t.generateColors = function (r) { var e = []; for (var a = 0; a < r; a++)
            e.push(t.getColor(a)); return e; };
        t.generateTransparentColors = function (r) { var e = []; for (var a = 0; a < r; a++)
            e.push(t.transparentize(t.getColor(a), .5)); return e; };
        t.hsvGradientFromRgbColors = function (r, e, a) { var s = t.rgb2hsv(r.r, r.g, r.b), o = t.rgb2hsv(e.r, e.g, e.b); r.h = s[0], r.s = s[1], r.v = s[2], e.h = o[0], e.s = o[1], e.v = o[2]; var h = t.hsvGradient(r, e, a); for (var r_1 in h)
            h[r_1] && (h[r_1].rgb = t.hsv2rgb(h[r_1].h, h[r_1].s, h[r_1].v), h[r_1].r = Math.floor(h[r_1].rgb[0]), h[r_1].g = Math.floor(h[r_1].rgb[1]), h[r_1].b = Math.floor(h[r_1].rgb[2])); return h; };
        t.rgb2hsv = function (r, t, e) { var a, s, o, h = r / 255, n = t / 255, l = e / 255, c = Math.max(h, n, l), i = c - Math.min(h, n, l); if (o = c, 0 === i)
            a = 0, s = 0;
        else
            switch (s = i / o, c) {
                case h:
                    a = (n - l + i * (n < l ? 6 : 0)) / 6 * i;
                    break;
                case n:
                    a = (l - h + 2 * i) / 6 * i;
                    break;
                case l: a = (h - n + 4 * i) / 6 * i;
            } return [a, s, o]; };
        t.hsvGradient = function (r, t, e) { var a = new Array(e), s = r.h >= t.h ? r.h - t.h : 1 + r.h - t.h, o = r.h >= t.h ? 1 + t.h - r.h : t.h - r.h; for (var h = 0; h < e; h++) {
            var n = o <= s ? r.h + o * h / (e - 1) : r.h - s * h / (e - 1);
            n < 0 && (n = 1 + n), n > 1 && (n -= 1);
            var l = (1 - h / (e - 1)) * r.s + h / (e - 1) * t.s, c = (1 - h / (e - 1)) * r.v + h / (e - 1) * t.v;
            a[h] = { h: n, s: l, v: c };
        } return a; };
        t.hsv2rgb = function (r, t, e) { var a, s, o, h = Math.floor(6 * r), n = 6 * r - h, l = e * (1 - t), c = e * (1 - n * t), i = e * (1 - (1 - n) * t); switch (h % 6) {
            case 0:
                a = e, s = i, o = l;
                break;
            case 1:
                a = c, s = e, o = l;
                break;
            case 2:
                a = l, s = e, o = i;
                break;
            case 3:
                a = l, s = c, o = e;
                break;
            case 4:
                a = i, s = l, o = e;
                break;
            case 5: a = e, s = l, o = c;
        } return [255 * a, 255 * s, 255 * o]; };
        t.rgb2hex = function (r, t, e) { function a(r) { var t = r.toString(16); return 1 === t.length ? "0" + t : t; } return "#" + a(r) + a(t) + a(e); };
        return t;
    }());  t.color = ["#5899DA", "#E8743B", "#19A979", "#ED4A7B", "#945ECF", "#13A4B4", "#525DF4", "#BF399E", "#6C8893", "#EE6868", "#2F6497"], r.ColorLib = t; });
