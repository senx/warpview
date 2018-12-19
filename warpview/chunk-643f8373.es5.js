/*! Built with http://stenciljs.com */
warpview.loadBundle("chunk-643f8373.js", ["exports"], function (r) { window.warpview.h;
    var e = /** @class */ (function () {
        function e() {
        }
        e.getColor = function (r) { return e.color[r % e.color.length]; };
        e.hexToRgb = function (r) { var e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(r); return e ? [parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16)] : null; };
        e.transparentize = function (r) { return "rgba(" + e.hexToRgb(r).concat(.7).join(",") + ")"; };
        e.generateColors = function (r) { var t = []; for (var a = 0; a < r; a++)
            t.push(e.getColor(a)); return t; };
        e.generateTransparentColors = function (r) { var t = []; for (var a = 0; a < r; a++)
            t.push(e.transparentize(e.getColor(a))); return t; };
        e.hsvGradientFromRgbColors = function (r, t, a) { var s = e.rgb2hsv(r.r, r.g, r.b), o = e.rgb2hsv(t.r, t.g, t.b); r.h = s[0], r.s = s[1], r.v = s[2], t.h = o[0], t.s = o[1], t.v = o[2]; var h = e.hsvGradient(r, t, a); for (var r_1 in h)
            h[r_1] && (h[r_1].rgb = e.hsv2rgb(h[r_1].h, h[r_1].s, h[r_1].v), h[r_1].r = Math.floor(h[r_1].rgb[0]), h[r_1].g = Math.floor(h[r_1].rgb[1]), h[r_1].b = Math.floor(h[r_1].rgb[2])); return h; };
        e.rgb2hsv = function (r, e, t) { var a, s, o, h = r / 255, n = e / 255, l = t / 255, c = Math.max(h, n, l), i = c - Math.min(h, n, l); if (o = c, 0 === i)
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
        e.hsvGradient = function (r, e, t) { var a = new Array(t), s = r.h >= e.h ? r.h - e.h : 1 + r.h - e.h, o = r.h >= e.h ? 1 + e.h - r.h : e.h - r.h; for (var h = 0; h < t; h++) {
            var n = o <= s ? r.h + o * h / (t - 1) : r.h - s * h / (t - 1);
            n < 0 && (n = 1 + n), n > 1 && (n -= 1);
            var l = (1 - h / (t - 1)) * r.s + h / (t - 1) * e.s, c = (1 - h / (t - 1)) * r.v + h / (t - 1) * e.v;
            a[h] = { h: n, s: l, v: c };
        } return a; };
        e.hsv2rgb = function (r, e, t) { var a, s, o, h = Math.floor(6 * r), n = 6 * r - h, l = t * (1 - e), c = t * (1 - n * e), i = t * (1 - (1 - n) * e); switch (h % 6) {
            case 0:
                a = t, s = i, o = l;
                break;
            case 1:
                a = c, s = t, o = l;
                break;
            case 2:
                a = l, s = t, o = i;
                break;
            case 3:
                a = l, s = c, o = t;
                break;
            case 4:
                a = i, s = l, o = t;
                break;
            case 5: a = t, s = l, o = c;
        } return [255 * a, 255 * s, 255 * o]; };
        e.rgb2hex = function (r, e, t) { function a(r) { var e = r.toString(16); return 1 === e.length ? "0" + e : e; } return "#" + a(r) + a(e) + a(t); };
        return e;
    }());  e.color = ["#ff9900", "#004eff", "#E53935", "#7CB342", "#F4511E", "#039BE5", "#D81B60", "#C0CA33", "#6D4C41", "#8E24AA", "#00ACC1", "#FDD835", "#5E35B1", "#00897B", "#FFB300", "#3949AB", "#43A047", "#1E88E5"], r.ColorLib = e; });
