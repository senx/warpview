/*! Built with http://stenciljs.com */
const { h } = window.quantumviz;

import { a as Draggabilly } from './chunk-f78e876a.js';
import './chunk-ee323282.js';

class QuantumChartZoom {
    constructor() {
        this.unit = "";
        this.type = "line";
        this.chartTitle = "";
        this.responsive = false;
        this.showLegend = false;
        this.data = "[]";
        this.hiddenData = "[]";
        this.options = "{}";
        this.width = "";
        this.height = "";
        this._chart = {
            xMin: 0,
            xMax: 0,
            yMin: 0,
            yMax: 0,
            xMinView: 0,
            xMaxView: 0,
            yMinView: 0,
            yMaxView: 0
        };
        this._xView = "{}";
        this._yView = "{}";
        this._slider = {
            x: {
                element: null,
                width: 0,
                max: 0,
                cursorSize: "{}"
            },
            y: {
                element: null,
                height: 0,
                max: 0,
                cursorSize: "{}"
            }
        };
    }
    changeScale(newValue, oldValue) {
        if (oldValue !== newValue) {
            this._options = newValue;
        }
    }
    chartInfosWatcher(event) {
        this._chart.xMin = event.detail.xMin;
        this._chart.xMinView = event.detail.xMin;
        this._chart.xMax = event.detail.xMax;
        this._slider.x.max = event.detail.xMax;
        this._chart.xMaxView = event.detail.xMax;
        this._chart.yMin = event.detail.yMin;
        this._chart.yMinView = event.detail.yMin;
        this._chart.yMax = event.detail.yMax;
        this._slider.y.max = event.detail.yMax;
        this._chart.yMaxView = event.detail.yMax;
    }
    xSliderInit() {
        this._slider.x.width = this.el.shadowRoot.querySelector("#myChart").getBoundingClientRect().width;
    }
    ySliderInit() {
        this._slider.y.height = this.el.shadowRoot.querySelector("#myChart").getBoundingClientRect().height;
    }
    componentDidLoad() {
        this.xSliderInit();
        this.ySliderInit();
        this.wc.forceUpdate();
        const chart = this.el.shadowRoot.querySelector("#myChart");
        this.png = chart.toBase64Image();
    }
    download() {
        const chart = this.el.shadowRoot.querySelector("#myChart");
        return (chart.toBase64Image());
    }
    xZoomListener(event) {
        let xMin = this._chart.xMinView;
        let xMax = this._chart.xMaxView;
        let diff = xMax - xMin;
        if (event.detail.zoomValue.zoomType > 0) {
            xMin = xMin + 0.1 * diff * event.detail.zoomValue.coef;
            xMax = xMax - 0.1 * diff * (1 - event.detail.zoomValue.coef);
        }
        else {
            xMin = xMin - 0.15 * diff * event.detail.zoomValue.coef;
            xMax = xMax + 0.15 * diff * (1 - event.detail.zoomValue.coef);
        }
        xMin = xMin < this._chart.xMin ? this._chart.xMin : xMin;
        xMax = xMax > this._chart.xMax ? this._chart.xMax : xMax;
        this._chart.xMinView = xMin;
        this._chart.xMaxView = xMax;
        this._xView = JSON.stringify({ min: this._chart.xMinView, max: this._chart.xMaxView });
        diff = this._chart.xMaxView - this._chart.xMinView;
        this._slider.x.max = this._chart.xMax - diff;
        let cursorSize = diff / (this._chart.xMax - this._chart.xMin);
        let cursorOffset = (this._chart.xMinView - this._chart.xMin) / (this._chart.xMax - this._chart.xMin);
        this._slider.x.cursorSize = JSON.stringify({ cursorSize: cursorSize, cursorOffset: cursorOffset });
        this.boundsDidChange.emit({ bounds: { min: this._chart.xMinView, max: this._chart.xMaxView } });
        this.wc.forceUpdate();
    }
    yZoomListener(event) {
        let yMin = this._chart.yMinView;
        let yMax = this._chart.yMaxView;
        let diff = yMax - yMin;
        if (event.detail.zoomValue.zoomType > 0) {
            yMin = yMin + 0.1 * diff * (1 - event.detail.zoomValue.coef);
            yMax = yMax - 0.1 * diff * event.detail.zoomValue.coef;
        }
        else {
            yMin = yMin - 0.15 * diff * (1 - event.detail.zoomValue.coef);
            yMax = yMax + 0.15 * diff * event.detail.zoomValue.coef;
        }
        yMin = yMin < this._chart.yMin ? this._chart.yMin : yMin;
        yMax = yMax > this._chart.yMax ? this._chart.yMax : yMax;
        this._chart.yMinView = yMin;
        this._chart.yMaxView = yMax;
        this._yView = JSON.stringify({ min: this._chart.yMinView, max: this._chart.yMaxView });
        diff = this._chart.yMaxView - this._chart.yMinView;
        this._slider.y.max = this._chart.yMax - diff;
        let cursorSize = diff / (this._chart.yMax - this._chart.yMin);
        let cursorOffset = (this._chart.yMax - this._chart.yMaxView) / (this._chart.yMax - this._chart.yMin);
        this._slider.y.cursorSize = JSON.stringify({ cursorSize: cursorSize, cursorOffset: cursorOffset });
        this.wc.forceUpdate();
    }
    xSliderListener(event) {
        let offset = event.detail.sliderValue - this._chart.xMinView;
        this._chart.xMinView += offset;
        this._chart.xMaxView += offset;
        this._xView = JSON.stringify({ min: this._chart.xMinView, max: this._chart.xMaxView });
        this.boundsDidChange.emit({ bounds: { min: this._chart.xMinView, max: this._chart.xMaxView } });
        this.wc.forceUpdate();
    }
    ySliderListener(event) {
        let offset = event.detail.sliderValue - this._chart.yMinView;
        this._chart.yMinView += offset;
        this._chart.yMaxView += offset;
        this._yView = JSON.stringify({ min: this._chart.yMinView, max: this._chart.yMaxView });
        this.wc.forceUpdate();
    }
    zoomReset() {
        this._chart.xMinView = this._chart.xMin;
        this._chart.xMaxView = this._chart.xMax;
        this._chart.yMinView = this._chart.yMin;
        this._chart.yMaxView = this._chart.yMax;
        this._xView = JSON.stringify({ min: this._chart.xMin, max: this._chart.xMax });
        this._yView = JSON.stringify({ min: this._chart.yMin, max: this._chart.yMax });
        this._slider.x.cursorSize = JSON.stringify({ cursorSize: 1, cursorOffset: 0 });
        this._slider.y.cursorSize = JSON.stringify({ cursorSize: 1, cursorOffset: 0 });
        this.boundsDidChange.emit({ bounds: { min: this._chart.xMin, max: this._chart.xMax } });
        this.wc.forceUpdate();
    }
    render() {
        return (h("div", { class: "wrapper" },
            h("quantum-vertical-zoom-slider", { height: this._slider.y.height, id: "ySlider", "min-value": this._chart.yMin, "max-value": this._slider.y.max, cursorSize: this._slider.y.cursorSize }),
            h("quantum-chart", { id: "myChart", alone: false, unit: this.unit, type: this.type, chartTitle: this.chartTitle, responsive: this.responsive, "show-legend": this.showLegend, data: this.data, hiddenData: this.hiddenData, options: this._options, width: this.width, height: this.height, timeMin: this.timeMin, timeMax: this.timeMax, xView: this._xView, yView: this._yView }),
            h("button", { id: "reset", type: "button", onClick: () => this.zoomReset() }, "Zoom Reset"),
            h("a", { href: this.png, download: "chart-" + Date.now() },
                h("i", { class: "fa fa-refresh fa-spin fa-3x fa-fw" })),
            h("div", { id: "xSliderWrapper" },
                h("quantum-horizontal-zoom-map", { id: "xSlider", img: this.png, width: this._slider.x.width, "min-value": this._chart.xMin, "max-value": this._slider.x.max, cursorSize: this._slider.x.cursorSize }))));
    }
    static get is() { return "quantum-chart-zoom"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chartTitle": {
            "type": String,
            "attr": "chart-title"
        },
        "data": {
            "type": String,
            "attr": "data"
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height"
        },
        "hiddenData": {
            "type": String,
            "attr": "hidden-data"
        },
        "options": {
            "type": String,
            "attr": "options",
            "watchCallbacks": ["changeScale"]
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "timeMax": {
            "type": Number,
            "attr": "time-max"
        },
        "timeMin": {
            "type": Number,
            "attr": "time-min"
        },
        "type": {
            "type": String,
            "attr": "type"
        },
        "unit": {
            "type": String,
            "attr": "unit"
        },
        "wc": {
            "elementRef": true
        },
        "width": {
            "type": String,
            "attr": "width"
        }
    }; }
    static get events() { return [{
            "name": "boundsDidChange",
            "method": "boundsDidChange",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "chartInfos",
            "method": "chartInfosWatcher"
        }, {
            "name": "xZoom",
            "method": "xZoomListener"
        }, {
            "name": "yZoom",
            "method": "yZoomListener"
        }, {
            "name": "xSliderValueChanged",
            "method": "xSliderListener"
        }, {
            "name": "ySliderValueChanged",
            "method": "ySliderListener"
        }]; }
    static get style() { return "/*!\n *  Font Awesome 4.7.0 by \@davegandy - http://fontawesome.io - \@fontawesome\n *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)\n */\@font-face{font-family:'FontAwesome';src:url('../fonts/fontawesome-webfont.eot?v=4.7.0');src:url('../fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'),url('../fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'),url('../fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'),url('../fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'),url('../fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg');font-weight:normal;font-style:normal}.fa{display:inline-block;font:normal normal normal 14px/1 FontAwesome;font-size:inherit;text-rendering:auto;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.fa-lg{font-size:1.33333333em;line-height:.75em;vertical-align:-15%}.fa-2x{font-size:2em}.fa-3x{font-size:3em}.fa-4x{font-size:4em}.fa-5x{font-size:5em}.fa-fw{width:1.28571429em;text-align:center}.fa-ul{padding-left:0;margin-left:2.14285714em;list-style-type:none}.fa-ul>li{position:relative}.fa-li{position:absolute;left:-2.14285714em;width:2.14285714em;top:.14285714em;text-align:center}.fa-li.fa-lg{left:-1.85714286em}.fa-border{padding:.2em .25em .15em;border:solid .08em #eee;border-radius:.1em}.fa-pull-left{float:left}.fa-pull-right{float:right}.fa.fa-pull-left{margin-right:.3em}.fa.fa-pull-right{margin-left:.3em}.pull-right{float:right}.pull-left{float:left}.fa.pull-left{margin-right:.3em}.fa.pull-right{margin-left:.3em}.fa-spin{-webkit-animation:fa-spin 2s infinite linear;animation:fa-spin 2s infinite linear}.fa-pulse{-webkit-animation:fa-spin 1s infinite steps(8);animation:fa-spin 1s infinite steps(8)}\@-webkit-keyframes fa-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}\@keyframes fa-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}.fa-rotate-90{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";-webkit-transform:rotate(90deg);-ms-transform:rotate(90deg);transform:rotate(90deg)}.fa-rotate-180{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";-webkit-transform:rotate(180deg);-ms-transform:rotate(180deg);transform:rotate(180deg)}.fa-rotate-270{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";-webkit-transform:rotate(270deg);-ms-transform:rotate(270deg);transform:rotate(270deg)}.fa-flip-horizontal{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";-webkit-transform:scale(-1, 1);-ms-transform:scale(-1, 1);transform:scale(-1, 1)}.fa-flip-vertical{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";-webkit-transform:scale(1, -1);-ms-transform:scale(1, -1);transform:scale(1, -1)}:root .fa-rotate-90,:root .fa-rotate-180,:root .fa-rotate-270,:root .fa-flip-horizontal,:root .fa-flip-vertical{-webkit-filter:none;filter:none}.fa-stack{position:relative;display:inline-block;width:2em;height:2em;line-height:2em;vertical-align:middle}.fa-stack-1x,.fa-stack-2x{position:absolute;left:0;width:100%;text-align:center}.fa-stack-1x{line-height:inherit}.fa-stack-2x{font-size:2em}.fa-inverse{color:#fff}.fa-glass:before{content:\"\\f000\"}.fa-music:before{content:\"\\f001\"}.fa-search:before{content:\"\\f002\"}.fa-envelope-o:before{content:\"\\f003\"}.fa-heart:before{content:\"\\f004\"}.fa-star:before{content:\"\\f005\"}.fa-star-o:before{content:\"\\f006\"}.fa-user:before{content:\"\\f007\"}.fa-film:before{content:\"\\f008\"}.fa-th-large:before{content:\"\\f009\"}.fa-th:before{content:\"\\f00a\"}.fa-th-list:before{content:\"\\f00b\"}.fa-check:before{content:\"\\f00c\"}.fa-remove:before,.fa-close:before,.fa-times:before{content:\"\\f00d\"}.fa-search-plus:before{content:\"\\f00e\"}.fa-search-minus:before{content:\"\\f010\"}.fa-power-off:before{content:\"\\f011\"}.fa-signal:before{content:\"\\f012\"}.fa-gear:before,.fa-cog:before{content:\"\\f013\"}.fa-trash-o:before{content:\"\\f014\"}.fa-home:before{content:\"\\f015\"}.fa-file-o:before{content:\"\\f016\"}.fa-clock-o:before{content:\"\\f017\"}.fa-road:before{content:\"\\f018\"}.fa-download:before{content:\"\\f019\"}.fa-arrow-circle-o-down:before{content:\"\\f01a\"}.fa-arrow-circle-o-up:before{content:\"\\f01b\"}.fa-inbox:before{content:\"\\f01c\"}.fa-play-circle-o:before{content:\"\\f01d\"}.fa-rotate-right:before,.fa-repeat:before{content:\"\\f01e\"}.fa-refresh:before{content:\"\\f021\"}.fa-list-alt:before{content:\"\\f022\"}.fa-lock:before{content:\"\\f023\"}.fa-flag:before{content:\"\\f024\"}.fa-headphones:before{content:\"\\f025\"}.fa-volume-off:before{content:\"\\f026\"}.fa-volume-down:before{content:\"\\f027\"}.fa-volume-up:before{content:\"\\f028\"}.fa-qrcode:before{content:\"\\f029\"}.fa-barcode:before{content:\"\\f02a\"}.fa-tag:before{content:\"\\f02b\"}.fa-tags:before{content:\"\\f02c\"}.fa-book:before{content:\"\\f02d\"}.fa-bookmark:before{content:\"\\f02e\"}.fa-print:before{content:\"\\f02f\"}.fa-camera:before{content:\"\\f030\"}.fa-font:before{content:\"\\f031\"}.fa-bold:before{content:\"\\f032\"}.fa-italic:before{content:\"\\f033\"}.fa-text-height:before{content:\"\\f034\"}.fa-text-width:before{content:\"\\f035\"}.fa-align-left:before{content:\"\\f036\"}.fa-align-center:before{content:\"\\f037\"}.fa-align-right:before{content:\"\\f038\"}.fa-align-justify:before{content:\"\\f039\"}.fa-list:before{content:\"\\f03a\"}.fa-dedent:before,.fa-outdent:before{content:\"\\f03b\"}.fa-indent:before{content:\"\\f03c\"}.fa-video-camera:before{content:\"\\f03d\"}.fa-photo:before,.fa-image:before,.fa-picture-o:before{content:\"\\f03e\"}.fa-pencil:before{content:\"\\f040\"}.fa-map-marker:before{content:\"\\f041\"}.fa-adjust:before{content:\"\\f042\"}.fa-tint:before{content:\"\\f043\"}.fa-edit:before,.fa-pencil-square-o:before{content:\"\\f044\"}.fa-share-square-o:before{content:\"\\f045\"}.fa-check-square-o:before{content:\"\\f046\"}.fa-arrows:before{content:\"\\f047\"}.fa-step-backward:before{content:\"\\f048\"}.fa-fast-backward:before{content:\"\\f049\"}.fa-backward:before{content:\"\\f04a\"}.fa-play:before{content:\"\\f04b\"}.fa-pause:before{content:\"\\f04c\"}.fa-stop:before{content:\"\\f04d\"}.fa-forward:before{content:\"\\f04e\"}.fa-fast-forward:before{content:\"\\f050\"}.fa-step-forward:before{content:\"\\f051\"}.fa-eject:before{content:\"\\f052\"}.fa-chevron-left:before{content:\"\\f053\"}.fa-chevron-right:before{content:\"\\f054\"}.fa-plus-circle:before{content:\"\\f055\"}.fa-minus-circle:before{content:\"\\f056\"}.fa-times-circle:before{content:\"\\f057\"}.fa-check-circle:before{content:\"\\f058\"}.fa-question-circle:before{content:\"\\f059\"}.fa-info-circle:before{content:\"\\f05a\"}.fa-crosshairs:before{content:\"\\f05b\"}.fa-times-circle-o:before{content:\"\\f05c\"}.fa-check-circle-o:before{content:\"\\f05d\"}.fa-ban:before{content:\"\\f05e\"}.fa-arrow-left:before{content:\"\\f060\"}.fa-arrow-right:before{content:\"\\f061\"}.fa-arrow-up:before{content:\"\\f062\"}.fa-arrow-down:before{content:\"\\f063\"}.fa-mail-forward:before,.fa-share:before{content:\"\\f064\"}.fa-expand:before{content:\"\\f065\"}.fa-compress:before{content:\"\\f066\"}.fa-plus:before{content:\"\\f067\"}.fa-minus:before{content:\"\\f068\"}.fa-asterisk:before{content:\"\\f069\"}.fa-exclamation-circle:before{content:\"\\f06a\"}.fa-gift:before{content:\"\\f06b\"}.fa-leaf:before{content:\"\\f06c\"}.fa-fire:before{content:\"\\f06d\"}.fa-eye:before{content:\"\\f06e\"}.fa-eye-slash:before{content:\"\\f070\"}.fa-warning:before,.fa-exclamation-triangle:before{content:\"\\f071\"}.fa-plane:before{content:\"\\f072\"}.fa-calendar:before{content:\"\\f073\"}.fa-random:before{content:\"\\f074\"}.fa-comment:before{content:\"\\f075\"}.fa-magnet:before{content:\"\\f076\"}.fa-chevron-up:before{content:\"\\f077\"}.fa-chevron-down:before{content:\"\\f078\"}.fa-retweet:before{content:\"\\f079\"}.fa-shopping-cart:before{content:\"\\f07a\"}.fa-folder:before{content:\"\\f07b\"}.fa-folder-open:before{content:\"\\f07c\"}.fa-arrows-v:before{content:\"\\f07d\"}.fa-arrows-h:before{content:\"\\f07e\"}.fa-bar-chart-o:before,.fa-bar-chart:before{content:\"\\f080\"}.fa-twitter-square:before{content:\"\\f081\"}.fa-facebook-square:before{content:\"\\f082\"}.fa-camera-retro:before{content:\"\\f083\"}.fa-key:before{content:\"\\f084\"}.fa-gears:before,.fa-cogs:before{content:\"\\f085\"}.fa-comments:before{content:\"\\f086\"}.fa-thumbs-o-up:before{content:\"\\f087\"}.fa-thumbs-o-down:before{content:\"\\f088\"}.fa-star-half:before{content:\"\\f089\"}.fa-heart-o:before{content:\"\\f08a\"}.fa-sign-out:before{content:\"\\f08b\"}.fa-linkedin-square:before{content:\"\\f08c\"}.fa-thumb-tack:before{content:\"\\f08d\"}.fa-external-link:before{content:\"\\f08e\"}.fa-sign-in:before{content:\"\\f090\"}.fa-trophy:before{content:\"\\f091\"}.fa-github-square:before{content:\"\\f092\"}.fa-upload:before{content:\"\\f093\"}.fa-lemon-o:before{content:\"\\f094\"}.fa-phone:before{content:\"\\f095\"}.fa-square-o:before{content:\"\\f096\"}.fa-bookmark-o:before{content:\"\\f097\"}.fa-phone-square:before{content:\"\\f098\"}.fa-twitter:before{content:\"\\f099\"}.fa-facebook-f:before,.fa-facebook:before{content:\"\\f09a\"}.fa-github:before{content:\"\\f09b\"}.fa-unlock:before{content:\"\\f09c\"}.fa-credit-card:before{content:\"\\f09d\"}.fa-feed:before,.fa-rss:before{content:\"\\f09e\"}.fa-hdd-o:before{content:\"\\f0a0\"}.fa-bullhorn:before{content:\"\\f0a1\"}.fa-bell:before{content:\"\\f0f3\"}.fa-certificate:before{content:\"\\f0a3\"}.fa-hand-o-right:before{content:\"\\f0a4\"}.fa-hand-o-left:before{content:\"\\f0a5\"}.fa-hand-o-up:before{content:\"\\f0a6\"}.fa-hand-o-down:before{content:\"\\f0a7\"}.fa-arrow-circle-left:before{content:\"\\f0a8\"}.fa-arrow-circle-right:before{content:\"\\f0a9\"}.fa-arrow-circle-up:before{content:\"\\f0aa\"}.fa-arrow-circle-down:before{content:\"\\f0ab\"}.fa-globe:before{content:\"\\f0ac\"}.fa-wrench:before{content:\"\\f0ad\"}.fa-tasks:before{content:\"\\f0ae\"}.fa-filter:before{content:\"\\f0b0\"}.fa-briefcase:before{content:\"\\f0b1\"}.fa-arrows-alt:before{content:\"\\f0b2\"}.fa-group:before,.fa-users:before{content:\"\\f0c0\"}.fa-chain:before,.fa-link:before{content:\"\\f0c1\"}.fa-cloud:before{content:\"\\f0c2\"}.fa-flask:before{content:\"\\f0c3\"}.fa-cut:before,.fa-scissors:before{content:\"\\f0c4\"}.fa-copy:before,.fa-files-o:before{content:\"\\f0c5\"}.fa-paperclip:before{content:\"\\f0c6\"}.fa-save:before,.fa-floppy-o:before{content:\"\\f0c7\"}.fa-square:before{content:\"\\f0c8\"}.fa-navicon:before,.fa-reorder:before,.fa-bars:before{content:\"\\f0c9\"}.fa-list-ul:before{content:\"\\f0ca\"}.fa-list-ol:before{content:\"\\f0cb\"}.fa-strikethrough:before{content:\"\\f0cc\"}.fa-underline:before{content:\"\\f0cd\"}.fa-table:before{content:\"\\f0ce\"}.fa-magic:before{content:\"\\f0d0\"}.fa-truck:before{content:\"\\f0d1\"}.fa-pinterest:before{content:\"\\f0d2\"}.fa-pinterest-square:before{content:\"\\f0d3\"}.fa-google-plus-square:before{content:\"\\f0d4\"}.fa-google-plus:before{content:\"\\f0d5\"}.fa-money:before{content:\"\\f0d6\"}.fa-caret-down:before{content:\"\\f0d7\"}.fa-caret-up:before{content:\"\\f0d8\"}.fa-caret-left:before{content:\"\\f0d9\"}.fa-caret-right:before{content:\"\\f0da\"}.fa-columns:before{content:\"\\f0db\"}.fa-unsorted:before,.fa-sort:before{content:\"\\f0dc\"}.fa-sort-down:before,.fa-sort-desc:before{content:\"\\f0dd\"}.fa-sort-up:before,.fa-sort-asc:before{content:\"\\f0de\"}.fa-envelope:before{content:\"\\f0e0\"}.fa-linkedin:before{content:\"\\f0e1\"}.fa-rotate-left:before,.fa-undo:before{content:\"\\f0e2\"}.fa-legal:before,.fa-gavel:before{content:\"\\f0e3\"}.fa-dashboard:before,.fa-tachometer:before{content:\"\\f0e4\"}.fa-comment-o:before{content:\"\\f0e5\"}.fa-comments-o:before{content:\"\\f0e6\"}.fa-flash:before,.fa-bolt:before{content:\"\\f0e7\"}.fa-sitemap:before{content:\"\\f0e8\"}.fa-umbrella:before{content:\"\\f0e9\"}.fa-paste:before,.fa-clipboard:before{content:\"\\f0ea\"}.fa-lightbulb-o:before{content:\"\\f0eb\"}.fa-exchange:before{content:\"\\f0ec\"}.fa-cloud-download:before{content:\"\\f0ed\"}.fa-cloud-upload:before{content:\"\\f0ee\"}.fa-user-md:before{content:\"\\f0f0\"}.fa-stethoscope:before{content:\"\\f0f1\"}.fa-suitcase:before{content:\"\\f0f2\"}.fa-bell-o:before{content:\"\\f0a2\"}.fa-coffee:before{content:\"\\f0f4\"}.fa-cutlery:before{content:\"\\f0f5\"}.fa-file-text-o:before{content:\"\\f0f6\"}.fa-building-o:before{content:\"\\f0f7\"}.fa-hospital-o:before{content:\"\\f0f8\"}.fa-ambulance:before{content:\"\\f0f9\"}.fa-medkit:before{content:\"\\f0fa\"}.fa-fighter-jet:before{content:\"\\f0fb\"}.fa-beer:before{content:\"\\f0fc\"}.fa-h-square:before{content:\"\\f0fd\"}.fa-plus-square:before{content:\"\\f0fe\"}.fa-angle-double-left:before{content:\"\\f100\"}.fa-angle-double-right:before{content:\"\\f101\"}.fa-angle-double-up:before{content:\"\\f102\"}.fa-angle-double-down:before{content:\"\\f103\"}.fa-angle-left:before{content:\"\\f104\"}.fa-angle-right:before{content:\"\\f105\"}.fa-angle-up:before{content:\"\\f106\"}.fa-angle-down:before{content:\"\\f107\"}.fa-desktop:before{content:\"\\f108\"}.fa-laptop:before{content:\"\\f109\"}.fa-tablet:before{content:\"\\f10a\"}.fa-mobile-phone:before,.fa-mobile:before{content:\"\\f10b\"}.fa-circle-o:before{content:\"\\f10c\"}.fa-quote-left:before{content:\"\\f10d\"}.fa-quote-right:before{content:\"\\f10e\"}.fa-spinner:before{content:\"\\f110\"}.fa-circle:before{content:\"\\f111\"}.fa-mail-reply:before,.fa-reply:before{content:\"\\f112\"}.fa-github-alt:before{content:\"\\f113\"}.fa-folder-o:before{content:\"\\f114\"}.fa-folder-open-o:before{content:\"\\f115\"}.fa-smile-o:before{content:\"\\f118\"}.fa-frown-o:before{content:\"\\f119\"}.fa-meh-o:before{content:\"\\f11a\"}.fa-gamepad:before{content:\"\\f11b\"}.fa-keyboard-o:before{content:\"\\f11c\"}.fa-flag-o:before{content:\"\\f11d\"}.fa-flag-checkered:before{content:\"\\f11e\"}.fa-terminal:before{content:\"\\f120\"}.fa-code:before{content:\"\\f121\"}.fa-mail-reply-all:before,.fa-reply-all:before{content:\"\\f122\"}.fa-star-half-empty:before,.fa-star-half-full:before,.fa-star-half-o:before{content:\"\\f123\"}.fa-location-arrow:before{content:\"\\f124\"}.fa-crop:before{content:\"\\f125\"}.fa-code-fork:before{content:\"\\f126\"}.fa-unlink:before,.fa-chain-broken:before{content:\"\\f127\"}.fa-question:before{content:\"\\f128\"}.fa-info:before{content:\"\\f129\"}.fa-exclamation:before{content:\"\\f12a\"}.fa-superscript:before{content:\"\\f12b\"}.fa-subscript:before{content:\"\\f12c\"}.fa-eraser:before{content:\"\\f12d\"}.fa-puzzle-piece:before{content:\"\\f12e\"}.fa-microphone:before{content:\"\\f130\"}.fa-microphone-slash:before{content:\"\\f131\"}.fa-shield:before{content:\"\\f132\"}.fa-calendar-o:before{content:\"\\f133\"}.fa-fire-extinguisher:before{content:\"\\f134\"}.fa-rocket:before{content:\"\\f135\"}.fa-maxcdn:before{content:\"\\f136\"}.fa-chevron-circle-left:before{content:\"\\f137\"}.fa-chevron-circle-right:before{content:\"\\f138\"}.fa-chevron-circle-up:before{content:\"\\f139\"}.fa-chevron-circle-down:before{content:\"\\f13a\"}.fa-html5:before{content:\"\\f13b\"}.fa-css3:before{content:\"\\f13c\"}.fa-anchor:before{content:\"\\f13d\"}.fa-unlock-alt:before{content:\"\\f13e\"}.fa-bullseye:before{content:\"\\f140\"}.fa-ellipsis-h:before{content:\"\\f141\"}.fa-ellipsis-v:before{content:\"\\f142\"}.fa-rss-square:before{content:\"\\f143\"}.fa-play-circle:before{content:\"\\f144\"}.fa-ticket:before{content:\"\\f145\"}.fa-minus-square:before{content:\"\\f146\"}.fa-minus-square-o:before{content:\"\\f147\"}.fa-level-up:before{content:\"\\f148\"}.fa-level-down:before{content:\"\\f149\"}.fa-check-square:before{content:\"\\f14a\"}.fa-pencil-square:before{content:\"\\f14b\"}.fa-external-link-square:before{content:\"\\f14c\"}.fa-share-square:before{content:\"\\f14d\"}.fa-compass:before{content:\"\\f14e\"}.fa-toggle-down:before,.fa-caret-square-o-down:before{content:\"\\f150\"}.fa-toggle-up:before,.fa-caret-square-o-up:before{content:\"\\f151\"}.fa-toggle-right:before,.fa-caret-square-o-right:before{content:\"\\f152\"}.fa-euro:before,.fa-eur:before{content:\"\\f153\"}.fa-gbp:before{content:\"\\f154\"}.fa-dollar:before,.fa-usd:before{content:\"\\f155\"}.fa-rupee:before,.fa-inr:before{content:\"\\f156\"}.fa-cny:before,.fa-rmb:before,.fa-yen:before,.fa-jpy:before{content:\"\\f157\"}.fa-ruble:before,.fa-rouble:before,.fa-rub:before{content:\"\\f158\"}.fa-won:before,.fa-krw:before{content:\"\\f159\"}.fa-bitcoin:before,.fa-btc:before{content:\"\\f15a\"}.fa-file:before{content:\"\\f15b\"}.fa-file-text:before{content:\"\\f15c\"}.fa-sort-alpha-asc:before{content:\"\\f15d\"}.fa-sort-alpha-desc:before{content:\"\\f15e\"}.fa-sort-amount-asc:before{content:\"\\f160\"}.fa-sort-amount-desc:before{content:\"\\f161\"}.fa-sort-numeric-asc:before{content:\"\\f162\"}.fa-sort-numeric-desc:before{content:\"\\f163\"}.fa-thumbs-up:before{content:\"\\f164\"}.fa-thumbs-down:before{content:\"\\f165\"}.fa-youtube-square:before{content:\"\\f166\"}.fa-youtube:before{content:\"\\f167\"}.fa-xing:before{content:\"\\f168\"}.fa-xing-square:before{content:\"\\f169\"}.fa-youtube-play:before{content:\"\\f16a\"}.fa-dropbox:before{content:\"\\f16b\"}.fa-stack-overflow:before{content:\"\\f16c\"}.fa-instagram:before{content:\"\\f16d\"}.fa-flickr:before{content:\"\\f16e\"}.fa-adn:before{content:\"\\f170\"}.fa-bitbucket:before{content:\"\\f171\"}.fa-bitbucket-square:before{content:\"\\f172\"}.fa-tumblr:before{content:\"\\f173\"}.fa-tumblr-square:before{content:\"\\f174\"}.fa-long-arrow-down:before{content:\"\\f175\"}.fa-long-arrow-up:before{content:\"\\f176\"}.fa-long-arrow-left:before{content:\"\\f177\"}.fa-long-arrow-right:before{content:\"\\f178\"}.fa-apple:before{content:\"\\f179\"}.fa-windows:before{content:\"\\f17a\"}.fa-android:before{content:\"\\f17b\"}.fa-linux:before{content:\"\\f17c\"}.fa-dribbble:before{content:\"\\f17d\"}.fa-skype:before{content:\"\\f17e\"}.fa-foursquare:before{content:\"\\f180\"}.fa-trello:before{content:\"\\f181\"}.fa-female:before{content:\"\\f182\"}.fa-male:before{content:\"\\f183\"}.fa-gittip:before,.fa-gratipay:before{content:\"\\f184\"}.fa-sun-o:before{content:\"\\f185\"}.fa-moon-o:before{content:\"\\f186\"}.fa-archive:before{content:\"\\f187\"}.fa-bug:before{content:\"\\f188\"}.fa-vk:before{content:\"\\f189\"}.fa-weibo:before{content:\"\\f18a\"}.fa-renren:before{content:\"\\f18b\"}.fa-pagelines:before{content:\"\\f18c\"}.fa-stack-exchange:before{content:\"\\f18d\"}.fa-arrow-circle-o-right:before{content:\"\\f18e\"}.fa-arrow-circle-o-left:before{content:\"\\f190\"}.fa-toggle-left:before,.fa-caret-square-o-left:before{content:\"\\f191\"}.fa-dot-circle-o:before{content:\"\\f192\"}.fa-wheelchair:before{content:\"\\f193\"}.fa-vimeo-square:before{content:\"\\f194\"}.fa-turkish-lira:before,.fa-try:before{content:\"\\f195\"}.fa-plus-square-o:before{content:\"\\f196\"}.fa-space-shuttle:before{content:\"\\f197\"}.fa-slack:before{content:\"\\f198\"}.fa-envelope-square:before{content:\"\\f199\"}.fa-wordpress:before{content:\"\\f19a\"}.fa-openid:before{content:\"\\f19b\"}.fa-institution:before,.fa-bank:before,.fa-university:before{content:\"\\f19c\"}.fa-mortar-board:before,.fa-graduation-cap:before{content:\"\\f19d\"}.fa-yahoo:before{content:\"\\f19e\"}.fa-google:before{content:\"\\f1a0\"}.fa-reddit:before{content:\"\\f1a1\"}.fa-reddit-square:before{content:\"\\f1a2\"}.fa-stumbleupon-circle:before{content:\"\\f1a3\"}.fa-stumbleupon:before{content:\"\\f1a4\"}.fa-delicious:before{content:\"\\f1a5\"}.fa-digg:before{content:\"\\f1a6\"}.fa-pied-piper-pp:before{content:\"\\f1a7\"}.fa-pied-piper-alt:before{content:\"\\f1a8\"}.fa-drupal:before{content:\"\\f1a9\"}.fa-joomla:before{content:\"\\f1aa\"}.fa-language:before{content:\"\\f1ab\"}.fa-fax:before{content:\"\\f1ac\"}.fa-building:before{content:\"\\f1ad\"}.fa-child:before{content:\"\\f1ae\"}.fa-paw:before{content:\"\\f1b0\"}.fa-spoon:before{content:\"\\f1b1\"}.fa-cube:before{content:\"\\f1b2\"}.fa-cubes:before{content:\"\\f1b3\"}.fa-behance:before{content:\"\\f1b4\"}.fa-behance-square:before{content:\"\\f1b5\"}.fa-steam:before{content:\"\\f1b6\"}.fa-steam-square:before{content:\"\\f1b7\"}.fa-recycle:before{content:\"\\f1b8\"}.fa-automobile:before,.fa-car:before{content:\"\\f1b9\"}.fa-cab:before,.fa-taxi:before{content:\"\\f1ba\"}.fa-tree:before{content:\"\\f1bb\"}.fa-spotify:before{content:\"\\f1bc\"}.fa-deviantart:before{content:\"\\f1bd\"}.fa-soundcloud:before{content:\"\\f1be\"}.fa-database:before{content:\"\\f1c0\"}.fa-file-pdf-o:before{content:\"\\f1c1\"}.fa-file-word-o:before{content:\"\\f1c2\"}.fa-file-excel-o:before{content:\"\\f1c3\"}.fa-file-powerpoint-o:before{content:\"\\f1c4\"}.fa-file-photo-o:before,.fa-file-picture-o:before,.fa-file-image-o:before{content:\"\\f1c5\"}.fa-file-zip-o:before,.fa-file-archive-o:before{content:\"\\f1c6\"}.fa-file-sound-o:before,.fa-file-audio-o:before{content:\"\\f1c7\"}.fa-file-movie-o:before,.fa-file-video-o:before{content:\"\\f1c8\"}.fa-file-code-o:before{content:\"\\f1c9\"}.fa-vine:before{content:\"\\f1ca\"}.fa-codepen:before{content:\"\\f1cb\"}.fa-jsfiddle:before{content:\"\\f1cc\"}.fa-life-bouy:before,.fa-life-buoy:before,.fa-life-saver:before,.fa-support:before,.fa-life-ring:before{content:\"\\f1cd\"}.fa-circle-o-notch:before{content:\"\\f1ce\"}.fa-ra:before,.fa-resistance:before,.fa-rebel:before{content:\"\\f1d0\"}.fa-ge:before,.fa-empire:before{content:\"\\f1d1\"}.fa-git-square:before{content:\"\\f1d2\"}.fa-git:before{content:\"\\f1d3\"}.fa-y-combinator-square:before,.fa-yc-square:before,.fa-hacker-news:before{content:\"\\f1d4\"}.fa-tencent-weibo:before{content:\"\\f1d5\"}.fa-qq:before{content:\"\\f1d6\"}.fa-wechat:before,.fa-weixin:before{content:\"\\f1d7\"}.fa-send:before,.fa-paper-plane:before{content:\"\\f1d8\"}.fa-send-o:before,.fa-paper-plane-o:before{content:\"\\f1d9\"}.fa-history:before{content:\"\\f1da\"}.fa-circle-thin:before{content:\"\\f1db\"}.fa-header:before{content:\"\\f1dc\"}.fa-paragraph:before{content:\"\\f1dd\"}.fa-sliders:before{content:\"\\f1de\"}.fa-share-alt:before{content:\"\\f1e0\"}.fa-share-alt-square:before{content:\"\\f1e1\"}.fa-bomb:before{content:\"\\f1e2\"}.fa-soccer-ball-o:before,.fa-futbol-o:before{content:\"\\f1e3\"}.fa-tty:before{content:\"\\f1e4\"}.fa-binoculars:before{content:\"\\f1e5\"}.fa-plug:before{content:\"\\f1e6\"}.fa-slideshare:before{content:\"\\f1e7\"}.fa-twitch:before{content:\"\\f1e8\"}.fa-yelp:before{content:\"\\f1e9\"}.fa-newspaper-o:before{content:\"\\f1ea\"}.fa-wifi:before{content:\"\\f1eb\"}.fa-calculator:before{content:\"\\f1ec\"}.fa-paypal:before{content:\"\\f1ed\"}.fa-google-wallet:before{content:\"\\f1ee\"}.fa-cc-visa:before{content:\"\\f1f0\"}.fa-cc-mastercard:before{content:\"\\f1f1\"}.fa-cc-discover:before{content:\"\\f1f2\"}.fa-cc-amex:before{content:\"\\f1f3\"}.fa-cc-paypal:before{content:\"\\f1f4\"}.fa-cc-stripe:before{content:\"\\f1f5\"}.fa-bell-slash:before{content:\"\\f1f6\"}.fa-bell-slash-o:before{content:\"\\f1f7\"}.fa-trash:before{content:\"\\f1f8\"}.fa-copyright:before{content:\"\\f1f9\"}.fa-at:before{content:\"\\f1fa\"}.fa-eyedropper:before{content:\"\\f1fb\"}.fa-paint-brush:before{content:\"\\f1fc\"}.fa-birthday-cake:before{content:\"\\f1fd\"}.fa-area-chart:before{content:\"\\f1fe\"}.fa-pie-chart:before{content:\"\\f200\"}.fa-line-chart:before{content:\"\\f201\"}.fa-lastfm:before{content:\"\\f202\"}.fa-lastfm-square:before{content:\"\\f203\"}.fa-toggle-off:before{content:\"\\f204\"}.fa-toggle-on:before{content:\"\\f205\"}.fa-bicycle:before{content:\"\\f206\"}.fa-bus:before{content:\"\\f207\"}.fa-ioxhost:before{content:\"\\f208\"}.fa-angellist:before{content:\"\\f209\"}.fa-cc:before{content:\"\\f20a\"}.fa-shekel:before,.fa-sheqel:before,.fa-ils:before{content:\"\\f20b\"}.fa-meanpath:before{content:\"\\f20c\"}.fa-buysellads:before{content:\"\\f20d\"}.fa-connectdevelop:before{content:\"\\f20e\"}.fa-dashcube:before{content:\"\\f210\"}.fa-forumbee:before{content:\"\\f211\"}.fa-leanpub:before{content:\"\\f212\"}.fa-sellsy:before{content:\"\\f213\"}.fa-shirtsinbulk:before{content:\"\\f214\"}.fa-simplybuilt:before{content:\"\\f215\"}.fa-skyatlas:before{content:\"\\f216\"}.fa-cart-plus:before{content:\"\\f217\"}.fa-cart-arrow-down:before{content:\"\\f218\"}.fa-diamond:before{content:\"\\f219\"}.fa-ship:before{content:\"\\f21a\"}.fa-user-secret:before{content:\"\\f21b\"}.fa-motorcycle:before{content:\"\\f21c\"}.fa-street-view:before{content:\"\\f21d\"}.fa-heartbeat:before{content:\"\\f21e\"}.fa-venus:before{content:\"\\f221\"}.fa-mars:before{content:\"\\f222\"}.fa-mercury:before{content:\"\\f223\"}.fa-intersex:before,.fa-transgender:before{content:\"\\f224\"}.fa-transgender-alt:before{content:\"\\f225\"}.fa-venus-double:before{content:\"\\f226\"}.fa-mars-double:before{content:\"\\f227\"}.fa-venus-mars:before{content:\"\\f228\"}.fa-mars-stroke:before{content:\"\\f229\"}.fa-mars-stroke-v:before{content:\"\\f22a\"}.fa-mars-stroke-h:before{content:\"\\f22b\"}.fa-neuter:before{content:\"\\f22c\"}.fa-genderless:before{content:\"\\f22d\"}.fa-facebook-official:before{content:\"\\f230\"}.fa-pinterest-p:before{content:\"\\f231\"}.fa-whatsapp:before{content:\"\\f232\"}.fa-server:before{content:\"\\f233\"}.fa-user-plus:before{content:\"\\f234\"}.fa-user-times:before{content:\"\\f235\"}.fa-hotel:before,.fa-bed:before{content:\"\\f236\"}.fa-viacoin:before{content:\"\\f237\"}.fa-train:before{content:\"\\f238\"}.fa-subway:before{content:\"\\f239\"}.fa-medium:before{content:\"\\f23a\"}.fa-yc:before,.fa-y-combinator:before{content:\"\\f23b\"}.fa-optin-monster:before{content:\"\\f23c\"}.fa-opencart:before{content:\"\\f23d\"}.fa-expeditedssl:before{content:\"\\f23e\"}.fa-battery-4:before,.fa-battery:before,.fa-battery-full:before{content:\"\\f240\"}.fa-battery-3:before,.fa-battery-three-quarters:before{content:\"\\f241\"}.fa-battery-2:before,.fa-battery-half:before{content:\"\\f242\"}.fa-battery-1:before,.fa-battery-quarter:before{content:\"\\f243\"}.fa-battery-0:before,.fa-battery-empty:before{content:\"\\f244\"}.fa-mouse-pointer:before{content:\"\\f245\"}.fa-i-cursor:before{content:\"\\f246\"}.fa-object-group:before{content:\"\\f247\"}.fa-object-ungroup:before{content:\"\\f248\"}.fa-sticky-note:before{content:\"\\f249\"}.fa-sticky-note-o:before{content:\"\\f24a\"}.fa-cc-jcb:before{content:\"\\f24b\"}.fa-cc-diners-club:before{content:\"\\f24c\"}.fa-clone:before{content:\"\\f24d\"}.fa-balance-scale:before{content:\"\\f24e\"}.fa-hourglass-o:before{content:\"\\f250\"}.fa-hourglass-1:before,.fa-hourglass-start:before{content:\"\\f251\"}.fa-hourglass-2:before,.fa-hourglass-half:before{content:\"\\f252\"}.fa-hourglass-3:before,.fa-hourglass-end:before{content:\"\\f253\"}.fa-hourglass:before{content:\"\\f254\"}.fa-hand-grab-o:before,.fa-hand-rock-o:before{content:\"\\f255\"}.fa-hand-stop-o:before,.fa-hand-paper-o:before{content:\"\\f256\"}.fa-hand-scissors-o:before{content:\"\\f257\"}.fa-hand-lizard-o:before{content:\"\\f258\"}.fa-hand-spock-o:before{content:\"\\f259\"}.fa-hand-pointer-o:before{content:\"\\f25a\"}.fa-hand-peace-o:before{content:\"\\f25b\"}.fa-trademark:before{content:\"\\f25c\"}.fa-registered:before{content:\"\\f25d\"}.fa-creative-commons:before{content:\"\\f25e\"}.fa-gg:before{content:\"\\f260\"}.fa-gg-circle:before{content:\"\\f261\"}.fa-tripadvisor:before{content:\"\\f262\"}.fa-odnoklassniki:before{content:\"\\f263\"}.fa-odnoklassniki-square:before{content:\"\\f264\"}.fa-get-pocket:before{content:\"\\f265\"}.fa-wikipedia-w:before{content:\"\\f266\"}.fa-safari:before{content:\"\\f267\"}.fa-chrome:before{content:\"\\f268\"}.fa-firefox:before{content:\"\\f269\"}.fa-opera:before{content:\"\\f26a\"}.fa-internet-explorer:before{content:\"\\f26b\"}.fa-tv:before,.fa-television:before{content:\"\\f26c\"}.fa-contao:before{content:\"\\f26d\"}.fa-500px:before{content:\"\\f26e\"}.fa-amazon:before{content:\"\\f270\"}.fa-calendar-plus-o:before{content:\"\\f271\"}.fa-calendar-minus-o:before{content:\"\\f272\"}.fa-calendar-times-o:before{content:\"\\f273\"}.fa-calendar-check-o:before{content:\"\\f274\"}.fa-industry:before{content:\"\\f275\"}.fa-map-pin:before{content:\"\\f276\"}.fa-map-signs:before{content:\"\\f277\"}.fa-map-o:before{content:\"\\f278\"}.fa-map:before{content:\"\\f279\"}.fa-commenting:before{content:\"\\f27a\"}.fa-commenting-o:before{content:\"\\f27b\"}.fa-houzz:before{content:\"\\f27c\"}.fa-vimeo:before{content:\"\\f27d\"}.fa-black-tie:before{content:\"\\f27e\"}.fa-fonticons:before{content:\"\\f280\"}.fa-reddit-alien:before{content:\"\\f281\"}.fa-edge:before{content:\"\\f282\"}.fa-credit-card-alt:before{content:\"\\f283\"}.fa-codiepie:before{content:\"\\f284\"}.fa-modx:before{content:\"\\f285\"}.fa-fort-awesome:before{content:\"\\f286\"}.fa-usb:before{content:\"\\f287\"}.fa-product-hunt:before{content:\"\\f288\"}.fa-mixcloud:before{content:\"\\f289\"}.fa-scribd:before{content:\"\\f28a\"}.fa-pause-circle:before{content:\"\\f28b\"}.fa-pause-circle-o:before{content:\"\\f28c\"}.fa-stop-circle:before{content:\"\\f28d\"}.fa-stop-circle-o:before{content:\"\\f28e\"}.fa-shopping-bag:before{content:\"\\f290\"}.fa-shopping-basket:before{content:\"\\f291\"}.fa-hashtag:before{content:\"\\f292\"}.fa-bluetooth:before{content:\"\\f293\"}.fa-bluetooth-b:before{content:\"\\f294\"}.fa-percent:before{content:\"\\f295\"}.fa-gitlab:before{content:\"\\f296\"}.fa-wpbeginner:before{content:\"\\f297\"}.fa-wpforms:before{content:\"\\f298\"}.fa-envira:before{content:\"\\f299\"}.fa-universal-access:before{content:\"\\f29a\"}.fa-wheelchair-alt:before{content:\"\\f29b\"}.fa-question-circle-o:before{content:\"\\f29c\"}.fa-blind:before{content:\"\\f29d\"}.fa-audio-description:before{content:\"\\f29e\"}.fa-volume-control-phone:before{content:\"\\f2a0\"}.fa-braille:before{content:\"\\f2a1\"}.fa-assistive-listening-systems:before{content:\"\\f2a2\"}.fa-asl-interpreting:before,.fa-american-sign-language-interpreting:before{content:\"\\f2a3\"}.fa-deafness:before,.fa-hard-of-hearing:before,.fa-deaf:before{content:\"\\f2a4\"}.fa-glide:before{content:\"\\f2a5\"}.fa-glide-g:before{content:\"\\f2a6\"}.fa-signing:before,.fa-sign-language:before{content:\"\\f2a7\"}.fa-low-vision:before{content:\"\\f2a8\"}.fa-viadeo:before{content:\"\\f2a9\"}.fa-viadeo-square:before{content:\"\\f2aa\"}.fa-snapchat:before{content:\"\\f2ab\"}.fa-snapchat-ghost:before{content:\"\\f2ac\"}.fa-snapchat-square:before{content:\"\\f2ad\"}.fa-pied-piper:before{content:\"\\f2ae\"}.fa-first-order:before{content:\"\\f2b0\"}.fa-yoast:before{content:\"\\f2b1\"}.fa-themeisle:before{content:\"\\f2b2\"}.fa-google-plus-circle:before,.fa-google-plus-official:before{content:\"\\f2b3\"}.fa-fa:before,.fa-font-awesome:before{content:\"\\f2b4\"}.fa-handshake-o:before{content:\"\\f2b5\"}.fa-envelope-open:before{content:\"\\f2b6\"}.fa-envelope-open-o:before{content:\"\\f2b7\"}.fa-linode:before{content:\"\\f2b8\"}.fa-address-book:before{content:\"\\f2b9\"}.fa-address-book-o:before{content:\"\\f2ba\"}.fa-vcard:before,.fa-address-card:before{content:\"\\f2bb\"}.fa-vcard-o:before,.fa-address-card-o:before{content:\"\\f2bc\"}.fa-user-circle:before{content:\"\\f2bd\"}.fa-user-circle-o:before{content:\"\\f2be\"}.fa-user-o:before{content:\"\\f2c0\"}.fa-id-badge:before{content:\"\\f2c1\"}.fa-drivers-license:before,.fa-id-card:before{content:\"\\f2c2\"}.fa-drivers-license-o:before,.fa-id-card-o:before{content:\"\\f2c3\"}.fa-quora:before{content:\"\\f2c4\"}.fa-free-code-camp:before{content:\"\\f2c5\"}.fa-telegram:before{content:\"\\f2c6\"}.fa-thermometer-4:before,.fa-thermometer:before,.fa-thermometer-full:before{content:\"\\f2c7\"}.fa-thermometer-3:before,.fa-thermometer-three-quarters:before{content:\"\\f2c8\"}.fa-thermometer-2:before,.fa-thermometer-half:before{content:\"\\f2c9\"}.fa-thermometer-1:before,.fa-thermometer-quarter:before{content:\"\\f2ca\"}.fa-thermometer-0:before,.fa-thermometer-empty:before{content:\"\\f2cb\"}.fa-shower:before{content:\"\\f2cc\"}.fa-bathtub:before,.fa-s15:before,.fa-bath:before{content:\"\\f2cd\"}.fa-podcast:before{content:\"\\f2ce\"}.fa-window-maximize:before{content:\"\\f2d0\"}.fa-window-minimize:before{content:\"\\f2d1\"}.fa-window-restore:before{content:\"\\f2d2\"}.fa-times-rectangle:before,.fa-window-close:before{content:\"\\f2d3\"}.fa-times-rectangle-o:before,.fa-window-close-o:before{content:\"\\f2d4\"}.fa-bandcamp:before{content:\"\\f2d5\"}.fa-grav:before{content:\"\\f2d6\"}.fa-etsy:before{content:\"\\f2d7\"}.fa-imdb:before{content:\"\\f2d8\"}.fa-ravelry:before{content:\"\\f2d9\"}.fa-eercast:before{content:\"\\f2da\"}.fa-microchip:before{content:\"\\f2db\"}.fa-snowflake-o:before{content:\"\\f2dc\"}.fa-superpowers:before{content:\"\\f2dd\"}.fa-wpexplorer:before{content:\"\\f2de\"}.fa-meetup:before{content:\"\\f2e0\"}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);border:0}.sr-only-focusable:active,.sr-only-focusable:focus{position:static;width:auto;height:auto;margin:0;overflow:visible;clip:auto}\n\n\n\@charset \"UTF-8\";\n/*!\n *  Font Awesome 4.7.0 by \@davegandy - http://fontawesome.io - \@fontawesome\n *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)\n */\n/* FONT PATH\n * -------------------------- */\n\@font-face {\n  font-family: 'FontAwesome';\n  src: url(\"/assets/fonts/fontawesome-webfont.eot?v=4.7.0\");\n  src: url(\"/assets/fonts/fontawesome-webfont.eot?#iefix&v=4.7.0\") format(\"embedded-opentype\"), url(\"/assets/fonts/fontawesome-webfont.woff2?v=4.7.0\") format(\"woff2\"), url(\"/assets/fonts/fontawesome-webfont.woff?v=4.7.0\") format(\"woff\"), url(\"/assets/fonts/fontawesome-webfont.ttf?v=4.7.0\") format(\"truetype\"), url(\"/assets/fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular\") format(\"svg\");\n  font-weight: normal;\n  font-style: normal; }\n\n.fa {\n  display: inline-block;\n  font: normal normal normal 14px/1 FontAwesome;\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n/* makes the font 33% larger relative to the icon container */\n.fa-lg {\n  font-size: 1.33333em;\n  line-height: 0.75em;\n  vertical-align: -15%; }\n\n.fa-2x {\n  font-size: 2em; }\n\n.fa-3x {\n  font-size: 3em; }\n\n.fa-4x {\n  font-size: 4em; }\n\n.fa-5x {\n  font-size: 5em; }\n\n.fa-fw {\n  width: 1.28571em;\n  text-align: center; }\n\n.fa-ul {\n  padding-left: 0;\n  margin-left: 2.14286em;\n  list-style-type: none; }\n  .fa-ul > li {\n    position: relative; }\n\n.fa-li {\n  position: absolute;\n  left: -2.14286em;\n  width: 2.14286em;\n  top: 0.14286em;\n  text-align: center; }\n  .fa-li.fa-lg {\n    left: -1.85714em; }\n\n.fa-border {\n  padding: .2em .25em .15em;\n  border: solid 0.08em #eee;\n  border-radius: .1em; }\n\n.fa-pull-left {\n  float: left; }\n\n.fa-pull-right {\n  float: right; }\n\n.fa.fa-pull-left {\n  margin-right: .3em; }\n\n.fa.fa-pull-right {\n  margin-left: .3em; }\n\n/* Deprecated as of 4.4.0 */\n.pull-right {\n  float: right; }\n\n.pull-left {\n  float: left; }\n\n.fa.pull-left {\n  margin-right: .3em; }\n\n.fa.pull-right {\n  margin-left: .3em; }\n\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n  animation: fa-spin 2s infinite linear; }\n\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n  animation: fa-spin 1s infinite steps(8); }\n\n\@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg); } }\n\n\@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg); } }\n\n.fa-rotate-90 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";\n  -webkit-transform: rotate(90deg);\n  -ms-transform: rotate(90deg);\n  transform: rotate(90deg); }\n\n.fa-rotate-180 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";\n  -webkit-transform: rotate(180deg);\n  -ms-transform: rotate(180deg);\n  transform: rotate(180deg); }\n\n.fa-rotate-270 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";\n  -webkit-transform: rotate(270deg);\n  -ms-transform: rotate(270deg);\n  transform: rotate(270deg); }\n\n.fa-flip-horizontal {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";\n  -webkit-transform: scale(-1, 1);\n  -ms-transform: scale(-1, 1);\n  transform: scale(-1, 1); }\n\n.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(1, -1);\n  -ms-transform: scale(1, -1);\n  transform: scale(1, -1); }\n\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical {\n  -webkit-filter: none;\n  filter: none; }\n\n.fa-stack {\n  position: relative;\n  display: inline-block;\n  width: 2em;\n  height: 2em;\n  line-height: 2em;\n  vertical-align: middle; }\n\n.fa-stack-1x, .fa-stack-2x {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  text-align: center; }\n\n.fa-stack-1x {\n  line-height: inherit; }\n\n.fa-stack-2x {\n  font-size: 2em; }\n\n.fa-inverse {\n  color: #fff; }\n\n/* Font Awesome uses the Unicode Private Use Area (PUA) to ensure screen\n   readers do not read off random characters that represent icons */\n.fa-glass:before {\n  content: \"\"; }\n\n.fa-music:before {\n  content: \"\"; }\n\n.fa-search:before {\n  content: \"\"; }\n\n.fa-envelope-o:before {\n  content: \"\"; }\n\n.fa-heart:before {\n  content: \"\"; }\n\n.fa-star:before {\n  content: \"\"; }\n\n.fa-star-o:before {\n  content: \"\"; }\n\n.fa-user:before {\n  content: \"\"; }\n\n.fa-film:before {\n  content: \"\"; }\n\n.fa-th-large:before {\n  content: \"\"; }\n\n.fa-th:before {\n  content: \"\"; }\n\n.fa-th-list:before {\n  content: \"\"; }\n\n.fa-check:before {\n  content: \"\"; }\n\n.fa-remove:before,\n.fa-close:before,\n.fa-times:before {\n  content: \"\"; }\n\n.fa-search-plus:before {\n  content: \"\"; }\n\n.fa-search-minus:before {\n  content: \"\"; }\n\n.fa-power-off:before {\n  content: \"\"; }\n\n.fa-signal:before {\n  content: \"\"; }\n\n.fa-gear:before,\n.fa-cog:before {\n  content: \"\"; }\n\n.fa-trash-o:before {\n  content: \"\"; }\n\n.fa-home:before {\n  content: \"\"; }\n\n.fa-file-o:before {\n  content: \"\"; }\n\n.fa-clock-o:before {\n  content: \"\"; }\n\n.fa-road:before {\n  content: \"\"; }\n\n.fa-download:before {\n  content: \"\"; }\n\n.fa-arrow-circle-o-down:before {\n  content: \"\"; }\n\n.fa-arrow-circle-o-up:before {\n  content: \"\"; }\n\n.fa-inbox:before {\n  content: \"\"; }\n\n.fa-play-circle-o:before {\n  content: \"\"; }\n\n.fa-rotate-right:before,\n.fa-repeat:before {\n  content: \"\"; }\n\n.fa-refresh:before {\n  content: \"\"; }\n\n.fa-list-alt:before {\n  content: \"\"; }\n\n.fa-lock:before {\n  content: \"\"; }\n\n.fa-flag:before {\n  content: \"\"; }\n\n.fa-headphones:before {\n  content: \"\"; }\n\n.fa-volume-off:before {\n  content: \"\"; }\n\n.fa-volume-down:before {\n  content: \"\"; }\n\n.fa-volume-up:before {\n  content: \"\"; }\n\n.fa-qrcode:before {\n  content: \"\"; }\n\n.fa-barcode:before {\n  content: \"\"; }\n\n.fa-tag:before {\n  content: \"\"; }\n\n.fa-tags:before {\n  content: \"\"; }\n\n.fa-book:before {\n  content: \"\"; }\n\n.fa-bookmark:before {\n  content: \"\"; }\n\n.fa-print:before {\n  content: \"\"; }\n\n.fa-camera:before {\n  content: \"\"; }\n\n.fa-font:before {\n  content: \"\"; }\n\n.fa-bold:before {\n  content: \"\"; }\n\n.fa-italic:before {\n  content: \"\"; }\n\n.fa-text-height:before {\n  content: \"\"; }\n\n.fa-text-width:before {\n  content: \"\"; }\n\n.fa-align-left:before {\n  content: \"\"; }\n\n.fa-align-center:before {\n  content: \"\"; }\n\n.fa-align-right:before {\n  content: \"\"; }\n\n.fa-align-justify:before {\n  content: \"\"; }\n\n.fa-list:before {\n  content: \"\"; }\n\n.fa-dedent:before,\n.fa-outdent:before {\n  content: \"\"; }\n\n.fa-indent:before {\n  content: \"\"; }\n\n.fa-video-camera:before {\n  content: \"\"; }\n\n.fa-photo:before,\n.fa-image:before,\n.fa-picture-o:before {\n  content: \"\"; }\n\n.fa-pencil:before {\n  content: \"\"; }\n\n.fa-map-marker:before {\n  content: \"\"; }\n\n.fa-adjust:before {\n  content: \"\"; }\n\n.fa-tint:before {\n  content: \"\"; }\n\n.fa-edit:before,\n.fa-pencil-square-o:before {\n  content: \"\"; }\n\n.fa-share-square-o:before {\n  content: \"\"; }\n\n.fa-check-square-o:before {\n  content: \"\"; }\n\n.fa-arrows:before {\n  content: \"\"; }\n\n.fa-step-backward:before {\n  content: \"\"; }\n\n.fa-fast-backward:before {\n  content: \"\"; }\n\n.fa-backward:before {\n  content: \"\"; }\n\n.fa-play:before {\n  content: \"\"; }\n\n.fa-pause:before {\n  content: \"\"; }\n\n.fa-stop:before {\n  content: \"\"; }\n\n.fa-forward:before {\n  content: \"\"; }\n\n.fa-fast-forward:before {\n  content: \"\"; }\n\n.fa-step-forward:before {\n  content: \"\"; }\n\n.fa-eject:before {\n  content: \"\"; }\n\n.fa-chevron-left:before {\n  content: \"\"; }\n\n.fa-chevron-right:before {\n  content: \"\"; }\n\n.fa-plus-circle:before {\n  content: \"\"; }\n\n.fa-minus-circle:before {\n  content: \"\"; }\n\n.fa-times-circle:before {\n  content: \"\"; }\n\n.fa-check-circle:before {\n  content: \"\"; }\n\n.fa-question-circle:before {\n  content: \"\"; }\n\n.fa-info-circle:before {\n  content: \"\"; }\n\n.fa-crosshairs:before {\n  content: \"\"; }\n\n.fa-times-circle-o:before {\n  content: \"\"; }\n\n.fa-check-circle-o:before {\n  content: \"\"; }\n\n.fa-ban:before {\n  content: \"\"; }\n\n.fa-arrow-left:before {\n  content: \"\"; }\n\n.fa-arrow-right:before {\n  content: \"\"; }\n\n.fa-arrow-up:before {\n  content: \"\"; }\n\n.fa-arrow-down:before {\n  content: \"\"; }\n\n.fa-mail-forward:before,\n.fa-share:before {\n  content: \"\"; }\n\n.fa-expand:before {\n  content: \"\"; }\n\n.fa-compress:before {\n  content: \"\"; }\n\n.fa-plus:before {\n  content: \"\"; }\n\n.fa-minus:before {\n  content: \"\"; }\n\n.fa-asterisk:before {\n  content: \"\"; }\n\n.fa-exclamation-circle:before {\n  content: \"\"; }\n\n.fa-gift:before {\n  content: \"\"; }\n\n.fa-leaf:before {\n  content: \"\"; }\n\n.fa-fire:before {\n  content: \"\"; }\n\n.fa-eye:before {\n  content: \"\"; }\n\n.fa-eye-slash:before {\n  content: \"\"; }\n\n.fa-warning:before,\n.fa-exclamation-triangle:before {\n  content: \"\"; }\n\n.fa-plane:before {\n  content: \"\"; }\n\n.fa-calendar:before {\n  content: \"\"; }\n\n.fa-random:before {\n  content: \"\"; }\n\n.fa-comment:before {\n  content: \"\"; }\n\n.fa-magnet:before {\n  content: \"\"; }\n\n.fa-chevron-up:before {\n  content: \"\"; }\n\n.fa-chevron-down:before {\n  content: \"\"; }\n\n.fa-retweet:before {\n  content: \"\"; }\n\n.fa-shopping-cart:before {\n  content: \"\"; }\n\n.fa-folder:before {\n  content: \"\"; }\n\n.fa-folder-open:before {\n  content: \"\"; }\n\n.fa-arrows-v:before {\n  content: \"\"; }\n\n.fa-arrows-h:before {\n  content: \"\"; }\n\n.fa-bar-chart-o:before,\n.fa-bar-chart:before {\n  content: \"\"; }\n\n.fa-twitter-square:before {\n  content: \"\"; }\n\n.fa-facebook-square:before {\n  content: \"\"; }\n\n.fa-camera-retro:before {\n  content: \"\"; }\n\n.fa-key:before {\n  content: \"\"; }\n\n.fa-gears:before,\n.fa-cogs:before {\n  content: \"\"; }\n\n.fa-comments:before {\n  content: \"\"; }\n\n.fa-thumbs-o-up:before {\n  content: \"\"; }\n\n.fa-thumbs-o-down:before {\n  content: \"\"; }\n\n.fa-star-half:before {\n  content: \"\"; }\n\n.fa-heart-o:before {\n  content: \"\"; }\n\n.fa-sign-out:before {\n  content: \"\"; }\n\n.fa-linkedin-square:before {\n  content: \"\"; }\n\n.fa-thumb-tack:before {\n  content: \"\"; }\n\n.fa-external-link:before {\n  content: \"\"; }\n\n.fa-sign-in:before {\n  content: \"\"; }\n\n.fa-trophy:before {\n  content: \"\"; }\n\n.fa-github-square:before {\n  content: \"\"; }\n\n.fa-upload:before {\n  content: \"\"; }\n\n.fa-lemon-o:before {\n  content: \"\"; }\n\n.fa-phone:before {\n  content: \"\"; }\n\n.fa-square-o:before {\n  content: \"\"; }\n\n.fa-bookmark-o:before {\n  content: \"\"; }\n\n.fa-phone-square:before {\n  content: \"\"; }\n\n.fa-twitter:before {\n  content: \"\"; }\n\n.fa-facebook-f:before,\n.fa-facebook:before {\n  content: \"\"; }\n\n.fa-github:before {\n  content: \"\"; }\n\n.fa-unlock:before {\n  content: \"\"; }\n\n.fa-credit-card:before {\n  content: \"\"; }\n\n.fa-feed:before,\n.fa-rss:before {\n  content: \"\"; }\n\n.fa-hdd-o:before {\n  content: \"\"; }\n\n.fa-bullhorn:before {\n  content: \"\"; }\n\n.fa-bell:before {\n  content: \"\"; }\n\n.fa-certificate:before {\n  content: \"\"; }\n\n.fa-hand-o-right:before {\n  content: \"\"; }\n\n.fa-hand-o-left:before {\n  content: \"\"; }\n\n.fa-hand-o-up:before {\n  content: \"\"; }\n\n.fa-hand-o-down:before {\n  content: \"\"; }\n\n.fa-arrow-circle-left:before {\n  content: \"\"; }\n\n.fa-arrow-circle-right:before {\n  content: \"\"; }\n\n.fa-arrow-circle-up:before {\n  content: \"\"; }\n\n.fa-arrow-circle-down:before {\n  content: \"\"; }\n\n.fa-globe:before {\n  content: \"\"; }\n\n.fa-wrench:before {\n  content: \"\"; }\n\n.fa-tasks:before {\n  content: \"\"; }\n\n.fa-filter:before {\n  content: \"\"; }\n\n.fa-briefcase:before {\n  content: \"\"; }\n\n.fa-arrows-alt:before {\n  content: \"\"; }\n\n.fa-group:before,\n.fa-users:before {\n  content: \"\"; }\n\n.fa-chain:before,\n.fa-link:before {\n  content: \"\"; }\n\n.fa-cloud:before {\n  content: \"\"; }\n\n.fa-flask:before {\n  content: \"\"; }\n\n.fa-cut:before,\n.fa-scissors:before {\n  content: \"\"; }\n\n.fa-copy:before,\n.fa-files-o:before {\n  content: \"\"; }\n\n.fa-paperclip:before {\n  content: \"\"; }\n\n.fa-save:before,\n.fa-floppy-o:before {\n  content: \"\"; }\n\n.fa-square:before {\n  content: \"\"; }\n\n.fa-navicon:before,\n.fa-reorder:before,\n.fa-bars:before {\n  content: \"\"; }\n\n.fa-list-ul:before {\n  content: \"\"; }\n\n.fa-list-ol:before {\n  content: \"\"; }\n\n.fa-strikethrough:before {\n  content: \"\"; }\n\n.fa-underline:before {\n  content: \"\"; }\n\n.fa-table:before {\n  content: \"\"; }\n\n.fa-magic:before {\n  content: \"\"; }\n\n.fa-truck:before {\n  content: \"\"; }\n\n.fa-pinterest:before {\n  content: \"\"; }\n\n.fa-pinterest-square:before {\n  content: \"\"; }\n\n.fa-google-plus-square:before {\n  content: \"\"; }\n\n.fa-google-plus:before {\n  content: \"\"; }\n\n.fa-money:before {\n  content: \"\"; }\n\n.fa-caret-down:before {\n  content: \"\"; }\n\n.fa-caret-up:before {\n  content: \"\"; }\n\n.fa-caret-left:before {\n  content: \"\"; }\n\n.fa-caret-right:before {\n  content: \"\"; }\n\n.fa-columns:before {\n  content: \"\"; }\n\n.fa-unsorted:before,\n.fa-sort:before {\n  content: \"\"; }\n\n.fa-sort-down:before,\n.fa-sort-desc:before {\n  content: \"\"; }\n\n.fa-sort-up:before,\n.fa-sort-asc:before {\n  content: \"\"; }\n\n.fa-envelope:before {\n  content: \"\"; }\n\n.fa-linkedin:before {\n  content: \"\"; }\n\n.fa-rotate-left:before,\n.fa-undo:before {\n  content: \"\"; }\n\n.fa-legal:before,\n.fa-gavel:before {\n  content: \"\"; }\n\n.fa-dashboard:before,\n.fa-tachometer:before {\n  content: \"\"; }\n\n.fa-comment-o:before {\n  content: \"\"; }\n\n.fa-comments-o:before {\n  content: \"\"; }\n\n.fa-flash:before,\n.fa-bolt:before {\n  content: \"\"; }\n\n.fa-sitemap:before {\n  content: \"\"; }\n\n.fa-umbrella:before {\n  content: \"\"; }\n\n.fa-paste:before,\n.fa-clipboard:before {\n  content: \"\"; }\n\n.fa-lightbulb-o:before {\n  content: \"\"; }\n\n.fa-exchange:before {\n  content: \"\"; }\n\n.fa-cloud-download:before {\n  content: \"\"; }\n\n.fa-cloud-upload:before {\n  content: \"\"; }\n\n.fa-user-md:before {\n  content: \"\"; }\n\n.fa-stethoscope:before {\n  content: \"\"; }\n\n.fa-suitcase:before {\n  content: \"\"; }\n\n.fa-bell-o:before {\n  content: \"\"; }\n\n.fa-coffee:before {\n  content: \"\"; }\n\n.fa-cutlery:before {\n  content: \"\"; }\n\n.fa-file-text-o:before {\n  content: \"\"; }\n\n.fa-building-o:before {\n  content: \"\"; }\n\n.fa-hospital-o:before {\n  content: \"\"; }\n\n.fa-ambulance:before {\n  content: \"\"; }\n\n.fa-medkit:before {\n  content: \"\"; }\n\n.fa-fighter-jet:before {\n  content: \"\"; }\n\n.fa-beer:before {\n  content: \"\"; }\n\n.fa-h-square:before {\n  content: \"\"; }\n\n.fa-plus-square:before {\n  content: \"\"; }\n\n.fa-angle-double-left:before {\n  content: \"\"; }\n\n.fa-angle-double-right:before {\n  content: \"\"; }\n\n.fa-angle-double-up:before {\n  content: \"\"; }\n\n.fa-angle-double-down:before {\n  content: \"\"; }\n\n.fa-angle-left:before {\n  content: \"\"; }\n\n.fa-angle-right:before {\n  content: \"\"; }\n\n.fa-angle-up:before {\n  content: \"\"; }\n\n.fa-angle-down:before {\n  content: \"\"; }\n\n.fa-desktop:before {\n  content: \"\"; }\n\n.fa-laptop:before {\n  content: \"\"; }\n\n.fa-tablet:before {\n  content: \"\"; }\n\n.fa-mobile-phone:before,\n.fa-mobile:before {\n  content: \"\"; }\n\n.fa-circle-o:before {\n  content: \"\"; }\n\n.fa-quote-left:before {\n  content: \"\"; }\n\n.fa-quote-right:before {\n  content: \"\"; }\n\n.fa-spinner:before {\n  content: \"\"; }\n\n.fa-circle:before {\n  content: \"\"; }\n\n.fa-mail-reply:before,\n.fa-reply:before {\n  content: \"\"; }\n\n.fa-github-alt:before {\n  content: \"\"; }\n\n.fa-folder-o:before {\n  content: \"\"; }\n\n.fa-folder-open-o:before {\n  content: \"\"; }\n\n.fa-smile-o:before {\n  content: \"\"; }\n\n.fa-frown-o:before {\n  content: \"\"; }\n\n.fa-meh-o:before {\n  content: \"\"; }\n\n.fa-gamepad:before {\n  content: \"\"; }\n\n.fa-keyboard-o:before {\n  content: \"\"; }\n\n.fa-flag-o:before {\n  content: \"\"; }\n\n.fa-flag-checkered:before {\n  content: \"\"; }\n\n.fa-terminal:before {\n  content: \"\"; }\n\n.fa-code:before {\n  content: \"\"; }\n\n.fa-mail-reply-all:before,\n.fa-reply-all:before {\n  content: \"\"; }\n\n.fa-star-half-empty:before,\n.fa-star-half-full:before,\n.fa-star-half-o:before {\n  content: \"\"; }\n\n.fa-location-arrow:before {\n  content: \"\"; }\n\n.fa-crop:before {\n  content: \"\"; }\n\n.fa-code-fork:before {\n  content: \"\"; }\n\n.fa-unlink:before,\n.fa-chain-broken:before {\n  content: \"\"; }\n\n.fa-question:before {\n  content: \"\"; }\n\n.fa-info:before {\n  content: \"\"; }\n\n.fa-exclamation:before {\n  content: \"\"; }\n\n.fa-superscript:before {\n  content: \"\"; }\n\n.fa-subscript:before {\n  content: \"\"; }\n\n.fa-eraser:before {\n  content: \"\"; }\n\n.fa-puzzle-piece:before {\n  content: \"\"; }\n\n.fa-microphone:before {\n  content: \"\"; }\n\n.fa-microphone-slash:before {\n  content: \"\"; }\n\n.fa-shield:before {\n  content: \"\"; }\n\n.fa-calendar-o:before {\n  content: \"\"; }\n\n.fa-fire-extinguisher:before {\n  content: \"\"; }\n\n.fa-rocket:before {\n  content: \"\"; }\n\n.fa-maxcdn:before {\n  content: \"\"; }\n\n.fa-chevron-circle-left:before {\n  content: \"\"; }\n\n.fa-chevron-circle-right:before {\n  content: \"\"; }\n\n.fa-chevron-circle-up:before {\n  content: \"\"; }\n\n.fa-chevron-circle-down:before {\n  content: \"\"; }\n\n.fa-html5:before {\n  content: \"\"; }\n\n.fa-css3:before {\n  content: \"\"; }\n\n.fa-anchor:before {\n  content: \"\"; }\n\n.fa-unlock-alt:before {\n  content: \"\"; }\n\n.fa-bullseye:before {\n  content: \"\"; }\n\n.fa-ellipsis-h:before {\n  content: \"\"; }\n\n.fa-ellipsis-v:before {\n  content: \"\"; }\n\n.fa-rss-square:before {\n  content: \"\"; }\n\n.fa-play-circle:before {\n  content: \"\"; }\n\n.fa-ticket:before {\n  content: \"\"; }\n\n.fa-minus-square:before {\n  content: \"\"; }\n\n.fa-minus-square-o:before {\n  content: \"\"; }\n\n.fa-level-up:before {\n  content: \"\"; }\n\n.fa-level-down:before {\n  content: \"\"; }\n\n.fa-check-square:before {\n  content: \"\"; }\n\n.fa-pencil-square:before {\n  content: \"\"; }\n\n.fa-external-link-square:before {\n  content: \"\"; }\n\n.fa-share-square:before {\n  content: \"\"; }\n\n.fa-compass:before {\n  content: \"\"; }\n\n.fa-toggle-down:before,\n.fa-caret-square-o-down:before {\n  content: \"\"; }\n\n.fa-toggle-up:before,\n.fa-caret-square-o-up:before {\n  content: \"\"; }\n\n.fa-toggle-right:before,\n.fa-caret-square-o-right:before {\n  content: \"\"; }\n\n.fa-euro:before,\n.fa-eur:before {\n  content: \"\"; }\n\n.fa-gbp:before {\n  content: \"\"; }\n\n.fa-dollar:before,\n.fa-usd:before {\n  content: \"\"; }\n\n.fa-rupee:before,\n.fa-inr:before {\n  content: \"\"; }\n\n.fa-cny:before,\n.fa-rmb:before,\n.fa-yen:before,\n.fa-jpy:before {\n  content: \"\"; }\n\n.fa-ruble:before,\n.fa-rouble:before,\n.fa-rub:before {\n  content: \"\"; }\n\n.fa-won:before,\n.fa-krw:before {\n  content: \"\"; }\n\n.fa-bitcoin:before,\n.fa-btc:before {\n  content: \"\"; }\n\n.fa-file:before {\n  content: \"\"; }\n\n.fa-file-text:before {\n  content: \"\"; }\n\n.fa-sort-alpha-asc:before {\n  content: \"\"; }\n\n.fa-sort-alpha-desc:before {\n  content: \"\"; }\n\n.fa-sort-amount-asc:before {\n  content: \"\"; }\n\n.fa-sort-amount-desc:before {\n  content: \"\"; }\n\n.fa-sort-numeric-asc:before {\n  content: \"\"; }\n\n.fa-sort-numeric-desc:before {\n  content: \"\"; }\n\n.fa-thumbs-up:before {\n  content: \"\"; }\n\n.fa-thumbs-down:before {\n  content: \"\"; }\n\n.fa-youtube-square:before {\n  content: \"\"; }\n\n.fa-youtube:before {\n  content: \"\"; }\n\n.fa-xing:before {\n  content: \"\"; }\n\n.fa-xing-square:before {\n  content: \"\"; }\n\n.fa-youtube-play:before {\n  content: \"\"; }\n\n.fa-dropbox:before {\n  content: \"\"; }\n\n.fa-stack-overflow:before {\n  content: \"\"; }\n\n.fa-instagram:before {\n  content: \"\"; }\n\n.fa-flickr:before {\n  content: \"\"; }\n\n.fa-adn:before {\n  content: \"\"; }\n\n.fa-bitbucket:before {\n  content: \"\"; }\n\n.fa-bitbucket-square:before {\n  content: \"\"; }\n\n.fa-tumblr:before {\n  content: \"\"; }\n\n.fa-tumblr-square:before {\n  content: \"\"; }\n\n.fa-long-arrow-down:before {\n  content: \"\"; }\n\n.fa-long-arrow-up:before {\n  content: \"\"; }\n\n.fa-long-arrow-left:before {\n  content: \"\"; }\n\n.fa-long-arrow-right:before {\n  content: \"\"; }\n\n.fa-apple:before {\n  content: \"\"; }\n\n.fa-windows:before {\n  content: \"\"; }\n\n.fa-android:before {\n  content: \"\"; }\n\n.fa-linux:before {\n  content: \"\"; }\n\n.fa-dribbble:before {\n  content: \"\"; }\n\n.fa-skype:before {\n  content: \"\"; }\n\n.fa-foursquare:before {\n  content: \"\"; }\n\n.fa-trello:before {\n  content: \"\"; }\n\n.fa-female:before {\n  content: \"\"; }\n\n.fa-male:before {\n  content: \"\"; }\n\n.fa-gittip:before,\n.fa-gratipay:before {\n  content: \"\"; }\n\n.fa-sun-o:before {\n  content: \"\"; }\n\n.fa-moon-o:before {\n  content: \"\"; }\n\n.fa-archive:before {\n  content: \"\"; }\n\n.fa-bug:before {\n  content: \"\"; }\n\n.fa-vk:before {\n  content: \"\"; }\n\n.fa-weibo:before {\n  content: \"\"; }\n\n.fa-renren:before {\n  content: \"\"; }\n\n.fa-pagelines:before {\n  content: \"\"; }\n\n.fa-stack-exchange:before {\n  content: \"\"; }\n\n.fa-arrow-circle-o-right:before {\n  content: \"\"; }\n\n.fa-arrow-circle-o-left:before {\n  content: \"\"; }\n\n.fa-toggle-left:before,\n.fa-caret-square-o-left:before {\n  content: \"\"; }\n\n.fa-dot-circle-o:before {\n  content: \"\"; }\n\n.fa-wheelchair:before {\n  content: \"\"; }\n\n.fa-vimeo-square:before {\n  content: \"\"; }\n\n.fa-turkish-lira:before,\n.fa-try:before {\n  content: \"\"; }\n\n.fa-plus-square-o:before {\n  content: \"\"; }\n\n.fa-space-shuttle:before {\n  content: \"\"; }\n\n.fa-slack:before {\n  content: \"\"; }\n\n.fa-envelope-square:before {\n  content: \"\"; }\n\n.fa-wordpress:before {\n  content: \"\"; }\n\n.fa-openid:before {\n  content: \"\"; }\n\n.fa-institution:before,\n.fa-bank:before,\n.fa-university:before {\n  content: \"\"; }\n\n.fa-mortar-board:before,\n.fa-graduation-cap:before {\n  content: \"\"; }\n\n.fa-yahoo:before {\n  content: \"\"; }\n\n.fa-google:before {\n  content: \"\"; }\n\n.fa-reddit:before {\n  content: \"\"; }\n\n.fa-reddit-square:before {\n  content: \"\"; }\n\n.fa-stumbleupon-circle:before {\n  content: \"\"; }\n\n.fa-stumbleupon:before {\n  content: \"\"; }\n\n.fa-delicious:before {\n  content: \"\"; }\n\n.fa-digg:before {\n  content: \"\"; }\n\n.fa-pied-piper-pp:before {\n  content: \"\"; }\n\n.fa-pied-piper-alt:before {\n  content: \"\"; }\n\n.fa-drupal:before {\n  content: \"\"; }\n\n.fa-joomla:before {\n  content: \"\"; }\n\n.fa-language:before {\n  content: \"\"; }\n\n.fa-fax:before {\n  content: \"\"; }\n\n.fa-building:before {\n  content: \"\"; }\n\n.fa-child:before {\n  content: \"\"; }\n\n.fa-paw:before {\n  content: \"\"; }\n\n.fa-spoon:before {\n  content: \"\"; }\n\n.fa-cube:before {\n  content: \"\"; }\n\n.fa-cubes:before {\n  content: \"\"; }\n\n.fa-behance:before {\n  content: \"\"; }\n\n.fa-behance-square:before {\n  content: \"\"; }\n\n.fa-steam:before {\n  content: \"\"; }\n\n.fa-steam-square:before {\n  content: \"\"; }\n\n.fa-recycle:before {\n  content: \"\"; }\n\n.fa-automobile:before,\n.fa-car:before {\n  content: \"\"; }\n\n.fa-cab:before,\n.fa-taxi:before {\n  content: \"\"; }\n\n.fa-tree:before {\n  content: \"\"; }\n\n.fa-spotify:before {\n  content: \"\"; }\n\n.fa-deviantart:before {\n  content: \"\"; }\n\n.fa-soundcloud:before {\n  content: \"\"; }\n\n.fa-database:before {\n  content: \"\"; }\n\n.fa-file-pdf-o:before {\n  content: \"\"; }\n\n.fa-file-word-o:before {\n  content: \"\"; }\n\n.fa-file-excel-o:before {\n  content: \"\"; }\n\n.fa-file-powerpoint-o:before {\n  content: \"\"; }\n\n.fa-file-photo-o:before,\n.fa-file-picture-o:before,\n.fa-file-image-o:before {\n  content: \"\"; }\n\n.fa-file-zip-o:before,\n.fa-file-archive-o:before {\n  content: \"\"; }\n\n.fa-file-sound-o:before,\n.fa-file-audio-o:before {\n  content: \"\"; }\n\n.fa-file-movie-o:before,\n.fa-file-video-o:before {\n  content: \"\"; }\n\n.fa-file-code-o:before {\n  content: \"\"; }\n\n.fa-vine:before {\n  content: \"\"; }\n\n.fa-codepen:before {\n  content: \"\"; }\n\n.fa-jsfiddle:before {\n  content: \"\"; }\n\n.fa-life-bouy:before,\n.fa-life-buoy:before,\n.fa-life-saver:before,\n.fa-support:before,\n.fa-life-ring:before {\n  content: \"\"; }\n\n.fa-circle-o-notch:before {\n  content: \"\"; }\n\n.fa-ra:before,\n.fa-resistance:before,\n.fa-rebel:before {\n  content: \"\"; }\n\n.fa-ge:before,\n.fa-empire:before {\n  content: \"\"; }\n\n.fa-git-square:before {\n  content: \"\"; }\n\n.fa-git:before {\n  content: \"\"; }\n\n.fa-y-combinator-square:before,\n.fa-yc-square:before,\n.fa-hacker-news:before {\n  content: \"\"; }\n\n.fa-tencent-weibo:before {\n  content: \"\"; }\n\n.fa-qq:before {\n  content: \"\"; }\n\n.fa-wechat:before,\n.fa-weixin:before {\n  content: \"\"; }\n\n.fa-send:before,\n.fa-paper-plane:before {\n  content: \"\"; }\n\n.fa-send-o:before,\n.fa-paper-plane-o:before {\n  content: \"\"; }\n\n.fa-history:before {\n  content: \"\"; }\n\n.fa-circle-thin:before {\n  content: \"\"; }\n\n.fa-header:before {\n  content: \"\"; }\n\n.fa-paragraph:before {\n  content: \"\"; }\n\n.fa-sliders:before {\n  content: \"\"; }\n\n.fa-share-alt:before {\n  content: \"\"; }\n\n.fa-share-alt-square:before {\n  content: \"\"; }\n\n.fa-bomb:before {\n  content: \"\"; }\n\n.fa-soccer-ball-o:before,\n.fa-futbol-o:before {\n  content: \"\"; }\n\n.fa-tty:before {\n  content: \"\"; }\n\n.fa-binoculars:before {\n  content: \"\"; }\n\n.fa-plug:before {\n  content: \"\"; }\n\n.fa-slideshare:before {\n  content: \"\"; }\n\n.fa-twitch:before {\n  content: \"\"; }\n\n.fa-yelp:before {\n  content: \"\"; }\n\n.fa-newspaper-o:before {\n  content: \"\"; }\n\n.fa-wifi:before {\n  content: \"\"; }\n\n.fa-calculator:before {\n  content: \"\"; }\n\n.fa-paypal:before {\n  content: \"\"; }\n\n.fa-google-wallet:before {\n  content: \"\"; }\n\n.fa-cc-visa:before {\n  content: \"\"; }\n\n.fa-cc-mastercard:before {\n  content: \"\"; }\n\n.fa-cc-discover:before {\n  content: \"\"; }\n\n.fa-cc-amex:before {\n  content: \"\"; }\n\n.fa-cc-paypal:before {\n  content: \"\"; }\n\n.fa-cc-stripe:before {\n  content: \"\"; }\n\n.fa-bell-slash:before {\n  content: \"\"; }\n\n.fa-bell-slash-o:before {\n  content: \"\"; }\n\n.fa-trash:before {\n  content: \"\"; }\n\n.fa-copyright:before {\n  content: \"\"; }\n\n.fa-at:before {\n  content: \"\"; }\n\n.fa-eyedropper:before {\n  content: \"\"; }\n\n.fa-paint-brush:before {\n  content: \"\"; }\n\n.fa-birthday-cake:before {\n  content: \"\"; }\n\n.fa-area-chart:before {\n  content: \"\"; }\n\n.fa-pie-chart:before {\n  content: \"\"; }\n\n.fa-line-chart:before {\n  content: \"\"; }\n\n.fa-lastfm:before {\n  content: \"\"; }\n\n.fa-lastfm-square:before {\n  content: \"\"; }\n\n.fa-toggle-off:before {\n  content: \"\"; }\n\n.fa-toggle-on:before {\n  content: \"\"; }\n\n.fa-bicycle:before {\n  content: \"\"; }\n\n.fa-bus:before {\n  content: \"\"; }\n\n.fa-ioxhost:before {\n  content: \"\"; }\n\n.fa-angellist:before {\n  content: \"\"; }\n\n.fa-cc:before {\n  content: \"\"; }\n\n.fa-shekel:before,\n.fa-sheqel:before,\n.fa-ils:before {\n  content: \"\"; }\n\n.fa-meanpath:before {\n  content: \"\"; }\n\n.fa-buysellads:before {\n  content: \"\"; }\n\n.fa-connectdevelop:before {\n  content: \"\"; }\n\n.fa-dashcube:before {\n  content: \"\"; }\n\n.fa-forumbee:before {\n  content: \"\"; }\n\n.fa-leanpub:before {\n  content: \"\"; }\n\n.fa-sellsy:before {\n  content: \"\"; }\n\n.fa-shirtsinbulk:before {\n  content: \"\"; }\n\n.fa-simplybuilt:before {\n  content: \"\"; }\n\n.fa-skyatlas:before {\n  content: \"\"; }\n\n.fa-cart-plus:before {\n  content: \"\"; }\n\n.fa-cart-arrow-down:before {\n  content: \"\"; }\n\n.fa-diamond:before {\n  content: \"\"; }\n\n.fa-ship:before {\n  content: \"\"; }\n\n.fa-user-secret:before {\n  content: \"\"; }\n\n.fa-motorcycle:before {\n  content: \"\"; }\n\n.fa-street-view:before {\n  content: \"\"; }\n\n.fa-heartbeat:before {\n  content: \"\"; }\n\n.fa-venus:before {\n  content: \"\"; }\n\n.fa-mars:before {\n  content: \"\"; }\n\n.fa-mercury:before {\n  content: \"\"; }\n\n.fa-intersex:before,\n.fa-transgender:before {\n  content: \"\"; }\n\n.fa-transgender-alt:before {\n  content: \"\"; }\n\n.fa-venus-double:before {\n  content: \"\"; }\n\n.fa-mars-double:before {\n  content: \"\"; }\n\n.fa-venus-mars:before {\n  content: \"\"; }\n\n.fa-mars-stroke:before {\n  content: \"\"; }\n\n.fa-mars-stroke-v:before {\n  content: \"\"; }\n\n.fa-mars-stroke-h:before {\n  content: \"\"; }\n\n.fa-neuter:before {\n  content: \"\"; }\n\n.fa-genderless:before {\n  content: \"\"; }\n\n.fa-facebook-official:before {\n  content: \"\"; }\n\n.fa-pinterest-p:before {\n  content: \"\"; }\n\n.fa-whatsapp:before {\n  content: \"\"; }\n\n.fa-server:before {\n  content: \"\"; }\n\n.fa-user-plus:before {\n  content: \"\"; }\n\n.fa-user-times:before {\n  content: \"\"; }\n\n.fa-hotel:before,\n.fa-bed:before {\n  content: \"\"; }\n\n.fa-viacoin:before {\n  content: \"\"; }\n\n.fa-train:before {\n  content: \"\"; }\n\n.fa-subway:before {\n  content: \"\"; }\n\n.fa-medium:before {\n  content: \"\"; }\n\n.fa-yc:before,\n.fa-y-combinator:before {\n  content: \"\"; }\n\n.fa-optin-monster:before {\n  content: \"\"; }\n\n.fa-opencart:before {\n  content: \"\"; }\n\n.fa-expeditedssl:before {\n  content: \"\"; }\n\n.fa-battery-4:before,\n.fa-battery:before,\n.fa-battery-full:before {\n  content: \"\"; }\n\n.fa-battery-3:before,\n.fa-battery-three-quarters:before {\n  content: \"\"; }\n\n.fa-battery-2:before,\n.fa-battery-half:before {\n  content: \"\"; }\n\n.fa-battery-1:before,\n.fa-battery-quarter:before {\n  content: \"\"; }\n\n.fa-battery-0:before,\n.fa-battery-empty:before {\n  content: \"\"; }\n\n.fa-mouse-pointer:before {\n  content: \"\"; }\n\n.fa-i-cursor:before {\n  content: \"\"; }\n\n.fa-object-group:before {\n  content: \"\"; }\n\n.fa-object-ungroup:before {\n  content: \"\"; }\n\n.fa-sticky-note:before {\n  content: \"\"; }\n\n.fa-sticky-note-o:before {\n  content: \"\"; }\n\n.fa-cc-jcb:before {\n  content: \"\"; }\n\n.fa-cc-diners-club:before {\n  content: \"\"; }\n\n.fa-clone:before {\n  content: \"\"; }\n\n.fa-balance-scale:before {\n  content: \"\"; }\n\n.fa-hourglass-o:before {\n  content: \"\"; }\n\n.fa-hourglass-1:before,\n.fa-hourglass-start:before {\n  content: \"\"; }\n\n.fa-hourglass-2:before,\n.fa-hourglass-half:before {\n  content: \"\"; }\n\n.fa-hourglass-3:before,\n.fa-hourglass-end:before {\n  content: \"\"; }\n\n.fa-hourglass:before {\n  content: \"\"; }\n\n.fa-hand-grab-o:before,\n.fa-hand-rock-o:before {\n  content: \"\"; }\n\n.fa-hand-stop-o:before,\n.fa-hand-paper-o:before {\n  content: \"\"; }\n\n.fa-hand-scissors-o:before {\n  content: \"\"; }\n\n.fa-hand-lizard-o:before {\n  content: \"\"; }\n\n.fa-hand-spock-o:before {\n  content: \"\"; }\n\n.fa-hand-pointer-o:before {\n  content: \"\"; }\n\n.fa-hand-peace-o:before {\n  content: \"\"; }\n\n.fa-trademark:before {\n  content: \"\"; }\n\n.fa-registered:before {\n  content: \"\"; }\n\n.fa-creative-commons:before {\n  content: \"\"; }\n\n.fa-gg:before {\n  content: \"\"; }\n\n.fa-gg-circle:before {\n  content: \"\"; }\n\n.fa-tripadvisor:before {\n  content: \"\"; }\n\n.fa-odnoklassniki:before {\n  content: \"\"; }\n\n.fa-odnoklassniki-square:before {\n  content: \"\"; }\n\n.fa-get-pocket:before {\n  content: \"\"; }\n\n.fa-wikipedia-w:before {\n  content: \"\"; }\n\n.fa-safari:before {\n  content: \"\"; }\n\n.fa-chrome:before {\n  content: \"\"; }\n\n.fa-firefox:before {\n  content: \"\"; }\n\n.fa-opera:before {\n  content: \"\"; }\n\n.fa-internet-explorer:before {\n  content: \"\"; }\n\n.fa-tv:before,\n.fa-television:before {\n  content: \"\"; }\n\n.fa-contao:before {\n  content: \"\"; }\n\n.fa-500px:before {\n  content: \"\"; }\n\n.fa-amazon:before {\n  content: \"\"; }\n\n.fa-calendar-plus-o:before {\n  content: \"\"; }\n\n.fa-calendar-minus-o:before {\n  content: \"\"; }\n\n.fa-calendar-times-o:before {\n  content: \"\"; }\n\n.fa-calendar-check-o:before {\n  content: \"\"; }\n\n.fa-industry:before {\n  content: \"\"; }\n\n.fa-map-pin:before {\n  content: \"\"; }\n\n.fa-map-signs:before {\n  content: \"\"; }\n\n.fa-map-o:before {\n  content: \"\"; }\n\n.fa-map:before {\n  content: \"\"; }\n\n.fa-commenting:before {\n  content: \"\"; }\n\n.fa-commenting-o:before {\n  content: \"\"; }\n\n.fa-houzz:before {\n  content: \"\"; }\n\n.fa-vimeo:before {\n  content: \"\"; }\n\n.fa-black-tie:before {\n  content: \"\"; }\n\n.fa-fonticons:before {\n  content: \"\"; }\n\n.fa-reddit-alien:before {\n  content: \"\"; }\n\n.fa-edge:before {\n  content: \"\"; }\n\n.fa-credit-card-alt:before {\n  content: \"\"; }\n\n.fa-codiepie:before {\n  content: \"\"; }\n\n.fa-modx:before {\n  content: \"\"; }\n\n.fa-fort-awesome:before {\n  content: \"\"; }\n\n.fa-usb:before {\n  content: \"\"; }\n\n.fa-product-hunt:before {\n  content: \"\"; }\n\n.fa-mixcloud:before {\n  content: \"\"; }\n\n.fa-scribd:before {\n  content: \"\"; }\n\n.fa-pause-circle:before {\n  content: \"\"; }\n\n.fa-pause-circle-o:before {\n  content: \"\"; }\n\n.fa-stop-circle:before {\n  content: \"\"; }\n\n.fa-stop-circle-o:before {\n  content: \"\"; }\n\n.fa-shopping-bag:before {\n  content: \"\"; }\n\n.fa-shopping-basket:before {\n  content: \"\"; }\n\n.fa-hashtag:before {\n  content: \"\"; }\n\n.fa-bluetooth:before {\n  content: \"\"; }\n\n.fa-bluetooth-b:before {\n  content: \"\"; }\n\n.fa-percent:before {\n  content: \"\"; }\n\n.fa-gitlab:before {\n  content: \"\"; }\n\n.fa-wpbeginner:before {\n  content: \"\"; }\n\n.fa-wpforms:before {\n  content: \"\"; }\n\n.fa-envira:before {\n  content: \"\"; }\n\n.fa-universal-access:before {\n  content: \"\"; }\n\n.fa-wheelchair-alt:before {\n  content: \"\"; }\n\n.fa-question-circle-o:before {\n  content: \"\"; }\n\n.fa-blind:before {\n  content: \"\"; }\n\n.fa-audio-description:before {\n  content: \"\"; }\n\n.fa-volume-control-phone:before {\n  content: \"\"; }\n\n.fa-braille:before {\n  content: \"\"; }\n\n.fa-assistive-listening-systems:before {\n  content: \"\"; }\n\n.fa-asl-interpreting:before,\n.fa-american-sign-language-interpreting:before {\n  content: \"\"; }\n\n.fa-deafness:before,\n.fa-hard-of-hearing:before,\n.fa-deaf:before {\n  content: \"\"; }\n\n.fa-glide:before {\n  content: \"\"; }\n\n.fa-glide-g:before {\n  content: \"\"; }\n\n.fa-signing:before,\n.fa-sign-language:before {\n  content: \"\"; }\n\n.fa-low-vision:before {\n  content: \"\"; }\n\n.fa-viadeo:before {\n  content: \"\"; }\n\n.fa-viadeo-square:before {\n  content: \"\"; }\n\n.fa-snapchat:before {\n  content: \"\"; }\n\n.fa-snapchat-ghost:before {\n  content: \"\"; }\n\n.fa-snapchat-square:before {\n  content: \"\"; }\n\n.fa-pied-piper:before {\n  content: \"\"; }\n\n.fa-first-order:before {\n  content: \"\"; }\n\n.fa-yoast:before {\n  content: \"\"; }\n\n.fa-themeisle:before {\n  content: \"\"; }\n\n.fa-google-plus-circle:before,\n.fa-google-plus-official:before {\n  content: \"\"; }\n\n.fa-fa:before,\n.fa-font-awesome:before {\n  content: \"\"; }\n\n.fa-handshake-o:before {\n  content: \"\"; }\n\n.fa-envelope-open:before {\n  content: \"\"; }\n\n.fa-envelope-open-o:before {\n  content: \"\"; }\n\n.fa-linode:before {\n  content: \"\"; }\n\n.fa-address-book:before {\n  content: \"\"; }\n\n.fa-address-book-o:before {\n  content: \"\"; }\n\n.fa-vcard:before,\n.fa-address-card:before {\n  content: \"\"; }\n\n.fa-vcard-o:before,\n.fa-address-card-o:before {\n  content: \"\"; }\n\n.fa-user-circle:before {\n  content: \"\"; }\n\n.fa-user-circle-o:before {\n  content: \"\"; }\n\n.fa-user-o:before {\n  content: \"\"; }\n\n.fa-id-badge:before {\n  content: \"\"; }\n\n.fa-drivers-license:before,\n.fa-id-card:before {\n  content: \"\"; }\n\n.fa-drivers-license-o:before,\n.fa-id-card-o:before {\n  content: \"\"; }\n\n.fa-quora:before {\n  content: \"\"; }\n\n.fa-free-code-camp:before {\n  content: \"\"; }\n\n.fa-telegram:before {\n  content: \"\"; }\n\n.fa-thermometer-4:before,\n.fa-thermometer:before,\n.fa-thermometer-full:before {\n  content: \"\"; }\n\n.fa-thermometer-3:before,\n.fa-thermometer-three-quarters:before {\n  content: \"\"; }\n\n.fa-thermometer-2:before,\n.fa-thermometer-half:before {\n  content: \"\"; }\n\n.fa-thermometer-1:before,\n.fa-thermometer-quarter:before {\n  content: \"\"; }\n\n.fa-thermometer-0:before,\n.fa-thermometer-empty:before {\n  content: \"\"; }\n\n.fa-shower:before {\n  content: \"\"; }\n\n.fa-bathtub:before,\n.fa-s15:before,\n.fa-bath:before {\n  content: \"\"; }\n\n.fa-podcast:before {\n  content: \"\"; }\n\n.fa-window-maximize:before {\n  content: \"\"; }\n\n.fa-window-minimize:before {\n  content: \"\"; }\n\n.fa-window-restore:before {\n  content: \"\"; }\n\n.fa-times-rectangle:before,\n.fa-window-close:before {\n  content: \"\"; }\n\n.fa-times-rectangle-o:before,\n.fa-window-close-o:before {\n  content: \"\"; }\n\n.fa-bandcamp:before {\n  content: \"\"; }\n\n.fa-grav:before {\n  content: \"\"; }\n\n.fa-etsy:before {\n  content: \"\"; }\n\n.fa-imdb:before {\n  content: \"\"; }\n\n.fa-ravelry:before {\n  content: \"\"; }\n\n.fa-eercast:before {\n  content: \"\"; }\n\n.fa-microchip:before {\n  content: \"\"; }\n\n.fa-snowflake-o:before {\n  content: \"\"; }\n\n.fa-superpowers:before {\n  content: \"\"; }\n\n.fa-wpexplorer:before {\n  content: \"\"; }\n\n.fa-meetup:before {\n  content: \"\"; }\n\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0; }\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  clip: auto; }\n\n:host {\n  /*\n  \@font-face {\n    font-family: 'FontAwesome';\n    src: url(\"/assets/fonts/fontawesome-webfont.eot?v=4.7.0\");\n    src: url(\"/assets/fonts/fontawesome-webfont.eot?#iefix&v=4.7.0\") format(\"embedded-opentype\"), url(\"/assets/fonts/fontawesome-webfont.woff2?v=4.7.0\") format(\"woff2\"), url(\"/assets/fonts/fontawesome-webfont.woff?v=4.7.0\") format(\"woff\"), url(\"/assets/fonts/fontawesome-webfont.ttf?v=4.7.0\") format(\"truetype\"), url(\"/assets/fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular\") format(\"svg\");\n    font-weight: normal;\n    font-style: normal;\n    color: pink; }\n    */ }\n  :host .chart-container {\n    width: var(--quantum-chart-width, 100%);\n    height: var(--quantum-chart-height, 100%);\n    position: relative; }\n  :host .wrapper {\n    display: grid;\n    grid-template-columns: 30px auto;\n    grid-template-rows: auto 100px;\n    margin: 10px; }\n  :host #ySlider {\n    margin-top: 25px;\n    grid-row: 1;\n    grid-column: 1; }\n  :host #xSliderWrapper {\n    grid-row: 2;\n    grid-column: 2;\n    /*\n    .imgWrapper {\n      position: absolute;\n      height: 100px;\n      width: 100%;\n      margin-left: 150px;\n      overflow: hidden;\n\n      z-index: 1;\n      img {\n        position: relative;\n        height: 100%;\n        width: 100%;\n        margin-left: -150px;\n      }\n    }\n    */ }\n    :host #xSliderWrapper quantum-horizontal-zoom-map {\n      height: 100px;\n      width: 100%;\n      z-index: 10; }\n  :host #myChart {\n    grid-row: 1;\n    grid-column: 2; }\n  :host #reset {\n    z-index: 10;\n    background-color: var(--quantum-reset-bg-color, greenyellow);\n    border-radius: var(--quantum-reset-border-radius, 0px);\n    border-color: var(--quantum-reset-border-color, black);\n    width: var(--quantum-reset-width, 10px);\n    height: var(--quantum-reset-height, 10px); }"; }
}

class QuantumHorizontalZoomMap {
    constructor() {
        this.cursorSize = "{}";
        this.config = "{}";
        this._cursorMinWidth = 30;
        this.lastPos = 0;
    }
    changeCursorSize(newValue, oldValue) {
        if (oldValue !== newValue) {
            let object = JSON.parse(newValue);
            if (object.cursorOffset + object.cursorSize <= 100) {
                this._cursor.style.left = (object.cursorOffset * 100).toString() + "%";
                window.requestAnimationFrame(() => {
                    if (object.cursorSize * this._rail.getBoundingClientRect().width <
                        this._cursorMinWidth) {
                        this._cursor.style.width = this._cursorMinWidth.toString() + "px";
                    }
                    else {
                        this._cursor.style.width =
                            (object.cursorSize * 100).toString() + "%";
                    }
                });
            }
        }
    }
    initSize(newValue, oldValue) {
        if (oldValue !== newValue) {
            this._rail.style.width = (0.94 * newValue).toString() + "px";
            this._img.style.width = (newValue + 18).toString() + "px";
        }
    }
    componentWillLoad() {
        //this._config = GTSLib.mergeDeep(this._config, JSON.parse(this.config));
    }
    componentDidLoad() {
        this._rail = this.el.shadowRoot.querySelector("#rail");
        this._cursor = this.el.shadowRoot.querySelector("#cursor");
        this._img = this.el.shadowRoot.querySelector("#img");
        let drag = new Draggabilly(this._cursor, {
            axis: "x",
            containment: this._rail
        });
        drag.on("dragStart", (event, pointer) => {
            this.dimsX(event);
        });
        drag.on("dragMove", (event, pointer, moveVector) => {
            if ((event.pageX - this._mouseCursorLeftOffset) >= this._railMin + 1 && (event.pageX + this._mouseCursorRightOffset) <= this._railMax - 1) {
                let v = event.pageX - this._rail.offsetLeft - this._mouseCursorLeftOffset;
                v = Math.max(0, v);
                let value = (v / (this._railMax - this._railMin - this._cursorWidth)) *
                    (this.maxValue - this.minValue) +
                    this.minValue;
                window.setTimeout(() => this.xSliderValueChanged.emit({ sliderValue: value }));
            }
        });
    }
    dimsX(event) {
        let railDims = this._rail.getBoundingClientRect();
        let cursorDims = this._cursor.getBoundingClientRect();
        this._railMin = this._rail.offsetLeft;
        this._railMax = railDims.width + this._rail.offsetLeft;
        this._cursorWidth = cursorDims.width;
        this._mouseCursorLeftOffset =
            event.pageX - this._cursor.offsetLeft - this._rail.offsetLeft;
        this._mouseCursorRightOffset =
            cursorDims.width - this._mouseCursorLeftOffset;
    }
    xWheel(event) {
        event.preventDefault();
        let railDims = this._rail.getBoundingClientRect();
        let coef = (event.pageX - this._rail.offsetLeft) / railDims.width;
        this.xZoom.emit({ zoomValue: { coef: coef, zoomType: event.deltaY * -1 } });
    }
    positionClick(event) {
        event.preventDefault();
        if (event.pageX < this._railMin + this._cursor.offsetLeft ||
            event.pageX > this._railMin + this._cursor.offsetLeft + this._cursorWidth) {
            this.dimsX(event);
            let halfCursorWidth = this._cursorWidth / 2;
            let v;
            if (event.pageX - halfCursorWidth < this._rail.offsetLeft) {
                v = 0;
                this._cursor.style.left = "1px";
            }
            else if (event.pageX + halfCursorWidth > this._railMax) {
                v = this._railMax - this._railMin - this._cursorWidth;
                this._cursor.style.left = v.toString() + "px";
            }
            else {
                v = event.pageX - this._railMin - halfCursorWidth;
                this._cursor.style.left = v.toString() + "px";
            }
            let value = (v / (this._railMax - this._railMin - this._cursorWidth)) *
                (this.maxValue - this.minValue) +
                this.minValue;
            this.xSliderValueChanged.emit({ sliderValue: value });
        }
    }
    render() {
        return (h("div", { id: "rail", onWheel: event => this.xWheel(event), onMouseUp: event => this.positionClick(event) },
            h("div", { id: "cursor" }),
            h("img", { id: "img", src: this.img })));
    }
    static get is() { return "quantum-horizontal-zoom-map"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "config": {
            "type": String,
            "attr": "config"
        },
        "cursorSize": {
            "type": String,
            "attr": "cursor-size",
            "watchCallbacks": ["changeCursorSize"]
        },
        "el": {
            "elementRef": true
        },
        "img": {
            "type": String,
            "attr": "img"
        },
        "maxValue": {
            "type": Number,
            "attr": "max-value"
        },
        "minValue": {
            "type": Number,
            "attr": "min-value"
        },
        "width": {
            "type": Number,
            "attr": "width",
            "watchCallbacks": ["initSize"]
        }
    }; }
    static get events() { return [{
            "name": "xSliderValueChanged",
            "method": "xSliderValueChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "xZoom",
            "method": "xZoom",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ":host #rail {\n  position: relative;\n  border: 1px solid black;\n  float: right;\n  margin: 0 0 0 100px;\n  position: absolute;\n  height: 100px;\n  width: 100%;\n  overflow: hidden; }\n\n:host #img {\n  position: absolute;\n  height: 100px;\n  /*margin: -150px 0 -15px -155px;*/\n  top: 0;\n  right: -1.5%; }\n\n:host #cursor:hover {\n  opacity: 0.6; }\n\n:host #cursor {\n  z-index: 1;\n  opacity: 0.3;\n  background-color: grey;\n  position: relative;\n  cursor: move;\n  width: 100%;\n  height: 100%;\n  border-left: 3px solid red;\n  border-right: 3px solid red;\n  -webkit-transition: left .01s;\n  transition: left .01s; }"; }
}

class QuantumVerticalZoomSlider {
    constructor() {
        this.cursorSize = "{}";
        this.config = '{}';
        this._cursorMinHeight = 30;
    }
    changeCursorSize(newValue, oldValue) {
        if (oldValue !== newValue) {
            let object = JSON.parse(newValue);
            if (object.cursorOffset + object.cursorSize <= 100) {
                this._cursor.style.top = (object.cursorOffset * 100).toString() + "%";
                if (object.cursorSize * this._rail.getBoundingClientRect().height < this._cursorMinHeight) {
                    this._cursor.style.height = this._cursorMinHeight.toString() + "px";
                }
                else {
                    this._cursor.style.height = (object.cursorSize * 100).toString() + "%";
                }
            }
        }
    }
    initSize(newValue, oldValue) {
        if (oldValue !== newValue) {
            this._rail.style.height = (0.95 * newValue).toString() + "px";
        }
    }
    componentWillLoad() {
        //this._config = GTSLib.mergeDeep(this._config, JSON.parse(this.config));
    }
    componentDidLoad() {
        this._rail = this.el.shadowRoot.querySelector("#vrail");
        this._cursor = this.el.shadowRoot.querySelector("#vcursor");
        let drag = new Draggabilly(this._cursor, {
            axis: "y",
            containment: this._rail
        });
        drag.on("dragStart", (event, pointer) => {
            this.dimsY(event);
        });
        drag.on("dragMove", (event, pointer, moveVector) => {
            if ((event.pageY - this._mouseCursorTopOffset) >= this._railMin + 1 && (event.pageY + this._mouseCursorBottomOffset) <= this._railMax - 1) {
                let v = event.pageY - this._rail.offsetTop - this._mouseCursorTopOffset;
                v = Math.max(0, v);
                let value = ((v) / ((this._railMax - this._railMin) - this._cursorHeight)) * (this.maxValue - this.minValue) + this.minValue;
                value = (this.maxValue - value) + this.minValue;
                window.setTimeout(() => this.ySliderValueChanged.emit({ sliderValue: value }));
            }
        });
    }
    /*
      mouseDown(event) {
        event.preventDefault();
        let me = this;
        this.dimsY(event);
        console.log("vertical rail", event.pageY - this._rail.offsetTop);
        this._rail.onmousemove = (event) => {me.dragY(event, me)};
        this._cursor.onmouseup = (event) => {me.stopDrag(me)};
        this._rail.onmouseup = (event) => {me.stopDrag(me)};
        this._rail.onmouseout = (event) => {me.stopDrag(me)};
      }
    */
    dimsY(event) {
        let railDims = this._rail.getBoundingClientRect();
        let cursorDims = this._cursor.getBoundingClientRect();
        this._railMin = this._rail.offsetTop;
        this._railMax = railDims.height + this._rail.offsetTop;
        this._cursorHeight = cursorDims.height;
        this._mouseCursorTopOffset = event.pageY - this._rail.offsetTop - this._cursor.offsetTop;
        this._mouseCursorBottomOffset = cursorDims.height - this._mouseCursorTopOffset;
    }
    /*
      dragY(event, elem) {
        event.preventDefault();
        if ((event.pageY - elem._mouseCursorTopOffset) >= elem._railMin + 1 && (event.pageY + elem._mouseCursorBottomOffset) <= elem._railMax - 1) {
          let v = event.pageY - elem._rail.offsetTop - elem._mouseCursorTopOffset;
          v = v < 0 ? 0 : v;
          elem._cursor.style.top = v + "px";
          let value = ((v) / ((this._railMax - this._railMin) - this._cursorHeight)) * (this.maxValue - this.minValue) + this.minValue;
          value = (this.maxValue - this.minValue) - value;
          this.ySliderValueChanged.emit({sliderValue: value});
        }
      }
    
      stopDrag(elem) {
        elem._rail.onmouseup = null;
        elem._rail.onmousemove = null;
        elem._cursor.onmouseup = null;
        elem._rail.onmouseout = null;
      }
    */
    yWheel(event) {
        event.preventDefault();
        let railDims = this._rail.getBoundingClientRect();
        let coef = (event.pageY - this._rail.offsetTop) / railDims.height;
        this.yZoom.emit({ zoomValue: { coef: coef, zoomType: event.deltaY * -1 } });
    }
    render() {
        return (h("div", { id: "vrail", onWheel: (event) => this.yWheel(event) },
            h("div", { id: "vcursor" })));
    }
    static get is() { return "quantum-vertical-zoom-slider"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "config": {
            "type": String,
            "attr": "config"
        },
        "cursorSize": {
            "type": String,
            "attr": "cursor-size",
            "watchCallbacks": ["changeCursorSize"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": Number,
            "attr": "height",
            "watchCallbacks": ["initSize"]
        },
        "maxValue": {
            "type": Number,
            "attr": "max-value"
        },
        "minValue": {
            "type": Number,
            "attr": "min-value"
        }
    }; }
    static get events() { return [{
            "name": "ySliderValueChanged",
            "method": "ySliderValueChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "yZoom",
            "method": "yZoom",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ":host #vrail {\n  position: relative;\n  background-color: var(--quantum-bg-rail-color, grey);\n  opacity: 0.7;\n  width: 20px;\n  margin: 0 0 20px 0;\n  border: 1px solid var(--quantum-border-rail-color, black);\n  border-radius: var(--quantum-border-radius, 6px);\n  padding: 0 0 0 0; }\n\n:host #vrail:hover {\n  opacity: 1; }\n\n:host #vcursor {\n  background-color: var(--quantum-bg-cursor-color, red);\n  position: relative;\n  cursor: move;\n  width: 20px;\n  height: 100%;\n  border: 1px solid var(--quantum-border-cursor-color, black);\n  border-radius: var(--quantum-border-radius, 6px);\n  -webkit-transition: top .01s;\n  transition: top .01s; }"; }
}

export { QuantumChartZoom, QuantumHorizontalZoomMap, QuantumVerticalZoomSlider };
