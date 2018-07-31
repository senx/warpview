/*! Built with http://stenciljs.com */
const { h } = window.quantumviz;

import { a as GTSLib } from './chunk-cadd3091.js';

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
            h("quantum-chart", { id: "myChart", alone: false, unit: this.unit, type: this.type, chartTitle: this.chartTitle, responsive: this.responsive, "show-legend": this.showLegend, data: this.data, hiddenData: this.hiddenData, options: this.options, width: this.width, height: this.height, timeMin: this.timeMin, timeMax: this.timeMax, xView: this._xView, yView: this._yView }),
            h("button", { id: "reset", type: "button", onClick: () => this.zoomReset() }, "Zoom Reset"),
            h("div", { id: "xSliderWrapper" },
                h("quantum-horizontal-zoom-slider", { id: "xSlider", width: this._slider.x.width, "min-value": this._chart.xMin, "max-value": this._slider.x.max, cursorSize: this._slider.x.cursorSize }),
                h("div", { class: "imgWrapper" },
                    h("img", { src: this.png })))));
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
            "attr": "options"
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
    static get style() { return "[data-quantum-chart-zoom-host]   .chart-container[data-quantum-chart-zoom] {\n  width: var(--quantum-chart-width, 100%);\n  height: var(--quantum-chart-height, 100%);\n  position: relative; }\n\n[data-quantum-chart-zoom-host]   .wrapper[data-quantum-chart-zoom] {\n  display: grid;\n  grid-template-columns: 30px auto;\n  grid-template-rows: auto 100px;\n  margin: 10px; }\n\n[data-quantum-chart-zoom-host]   #ySlider[data-quantum-chart-zoom] {\n  margin-top: 25px;\n  grid-row: 1;\n  grid-column: 1; }\n\n[data-quantum-chart-zoom-host]   #xSliderWrapper[data-quantum-chart-zoom] {\n  grid-row: 2;\n  grid-column: 2; }\n  [data-quantum-chart-zoom-host]   #xSliderWrapper[data-quantum-chart-zoom]   .imgWrapper[data-quantum-chart-zoom] {\n    position: absolute;\n    height: 100px;\n    width: 100%;\n    margin-left: 150px;\n    overflow: hidden;\n    z-index: 1; }\n    [data-quantum-chart-zoom-host]   #xSliderWrapper[data-quantum-chart-zoom]   .imgWrapper[data-quantum-chart-zoom]   img[data-quantum-chart-zoom] {\n      position: relative;\n      height: 100%;\n      width: 100%;\n      margin-left: -150px; }\n  [data-quantum-chart-zoom-host]   #xSliderWrapper[data-quantum-chart-zoom]   quantum-horizontal-zoom-slider[data-quantum-chart-zoom] {\n    position: absolute;\n    height: 100px;\n    width: 100%;\n    z-index: 10; }\n\n[data-quantum-chart-zoom-host]   #myChart[data-quantum-chart-zoom] {\n  grid-row: 1;\n  grid-column: 2; }\n\n[data-quantum-chart-zoom-host]   #reset[data-quantum-chart-zoom] {\n  background-color: greenyellow;\n  border-radius: var(--quantum-reset-border-radius, 0px);\n  border-color: var(--quantum-reset-border-color, black);\n  width: var(--quantum-reset-width, 10px);\n  height: var(--quantum-reset-height, 10px); }"; }
}

class QuantumHorizontalZoomSlider {
    constructor() {
        this.cursorSize = "{}";
        this.config = '{}';
        this._config = {
            rail: {
                class: ''
            },
            cursor: {
                class: ''
            }
        };
        this._cursorMinWidth = 30;
    }
    changeCursorSize(newValue, oldValue) {
        if (oldValue !== newValue) {
            let object = JSON.parse(newValue);
            if (object.cursorOffset + object.cursorSize <= 100) {
                this._cursor.style.left = (object.cursorOffset * 100).toString() + "%";
                if (object.cursorSize * this._rail.getBoundingClientRect().width < this._cursorMinWidth) {
                    this._cursor.style.width = this._cursorMinWidth.toString() + "px";
                }
                else {
                    this._cursor.style.width = (object.cursorSize * 100).toString() + "%";
                }
            }
        }
    }
    initSize(newValue, oldValue) {
        if (oldValue !== newValue) {
            this._rail.style.width = (0.94 * newValue).toString() + "px";
            console.log("width", this._rail.style.width);
        }
    }
    componentWillLoad() {
        this._config = GTSLib.mergeDeep(this._config, JSON.parse(this.config));
    }
    componentDidLoad() {
        this._rail = this.el.shadowRoot.querySelector("#rail");
        this._cursor = this.el.shadowRoot.querySelector("#cursor");
    }
    mouseDown(event) {
        event.preventDefault();
        let me = this;
        this.dimsX(event);
        this._rail.onmousemove = (event) => { me.dragX(event, me); };
        this._cursor.onmouseup = (event) => { me.stopDrag(me); };
        this._rail.onmouseup = (event) => { me.stopDrag(me); };
        this._rail.onmouseout = (event) => { me.stopDrag(me); };
    }
    /*
      dimsX(event) {
        let railDims = this._rail.getBoundingClientRect() as DOMRect;
        let cursorDims = this._cursor.getBoundingClientRect() as DOMRect;
        this._railMin = railDims.x;
        this._railMax = railDims.width + this._railMin;
        this._cursorWidth = cursorDims.width;
        this._mouseCursorLeftOffset = event.x - cursorDims.x;
        this._mouseCursorRightOffset = cursorDims.width - this._mouseCursorLeftOffset;
      }
    */
    dimsX(event) {
        let railDims = this._rail.getBoundingClientRect();
        let cursorDims = this._cursor.getBoundingClientRect();
        this._railMin = this._rail.offsetLeft;
        this._railMax = railDims.width + this._rail.offsetLeft;
        this._cursorWidth = cursorDims.width;
        this._mouseCursorLeftOffset = event.pageX - this._cursor.offsetLeft - this._rail.offsetLeft;
        this._mouseCursorRightOffset = cursorDims.width - this._mouseCursorLeftOffset;
    }
    dragX(event, elem) {
        event.preventDefault();
        if ((event.pageX - elem._mouseCursorLeftOffset) >= elem._railMin + 1 && (event.pageX + elem._mouseCursorRightOffset) <= elem._railMax - 1) {
            let v = event.pageX - elem._rail.offsetLeft - elem._mouseCursorLeftOffset;
            v = v < 0 ? 0 : v;
            elem._cursor.style.left = v + "px";
            let value = ((v) / ((this._railMax - this._railMin) - this._cursorWidth)) * (this.maxValue - this.minValue) + this.minValue;
            this.xSliderValueChanged.emit({ sliderValue: value });
        }
    }
    stopDrag(elem) {
        elem._rail.onmouseup = null;
        elem._rail.onmousemove = null;
        elem._cursor.onmouseup = null;
        elem._rail.onmouseout = null;
    }
    xWheel(event) {
        event.preventDefault();
        let railDims = this._rail.getBoundingClientRect();
        let coef = (event.pageX - this._rail.offsetLeft) / railDims.width;
        this.xZoom.emit({ zoomValue: { coef: coef, zoomType: event.deltaY * -1 } });
    }
    positionClick(event) {
    }
    render() {
        return (h("div", { id: "rail", onWheel: (event) => this.xWheel(event), onClick: (event => this.positionClick(event)) },
            h("div", { id: "cursor", onMouseDown: (event) => this.mouseDown(event) })));
    }
    static get is() { return "quantum-horizontal-zoom-slider"; }
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
    static get style() { return "[data-quantum-horizontal-zoom-slider-host]   #rail[data-quantum-horizontal-zoom-slider] {\n  position: relative;\n  background-color: var(--quantum-bg-rail-color, grey);\n  opacity: 0.7;\n  height: 20px;\n  border: 1px solid var(--quantum-border-rail-color, black);\n  border-radius: var(--quantum-border-radius, 6px);\n  padding: 0 0 0 0;\n  float: right;\n  margin: 0 15px 0 0; }\n\n[data-quantum-horizontal-zoom-slider-host]   #rail[data-quantum-horizontal-zoom-slider]:hover {\n  opacity: 1; }\n\n[data-quantum-horizontal-zoom-slider-host]   #cursor[data-quantum-horizontal-zoom-slider] {\n  background-color: var(--quantum-bg-cursor-color, red);\n  position: relative;\n  cursor: move;\n  width: 100%;\n  height: 20px;\n  border: 1px solid var(--quantum-border-cursor-color, black);\n  border-radius: var(--quantum-border-radius, 6px);\n  -webkit-transition: left .01s;\n  transition: left .01s; }"; }
}

class QuantumVerticalZoomSlider {
    constructor() {
        this.cursorSize = "{}";
        this.config = '{}';
        this._config = {
            rail: {
                class: ''
            },
            cursor: {
                class: ''
            }
        };
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
            console.log("height", this._rail.style.height);
        }
    }
    componentWillLoad() {
        this._config = GTSLib.mergeDeep(this._config, JSON.parse(this.config));
    }
    componentDidLoad() {
        this._rail = this.el.shadowRoot.querySelector("#rail");
        this._cursor = this.el.shadowRoot.querySelector("#cursor");
    }
    mouseDown(event) {
        event.preventDefault();
        let me = this;
        this.dimsY(event);
        this._rail.onmousemove = (event) => { me.dragY(event, me); };
        this._cursor.onmouseup = (event) => { me.stopDrag(me); };
        this._rail.onmouseup = (event) => { me.stopDrag(me); };
        this._rail.onmouseout = (event) => { me.stopDrag(me); };
    }
    dimsY(event) {
        let railDims = this._rail.getBoundingClientRect();
        let cursorDims = this._cursor.getBoundingClientRect();
        this._railMin = this._rail.offsetTop;
        this._railMax = railDims.height + this._rail.offsetTop;
        this._cursorHeight = cursorDims.height;
        this._mouseCursorTopOffset = event.pageY - this._rail.offsetTop - this._cursor.offsetTop;
        this._mouseCursorBottomOffset = cursorDims.height - this._mouseCursorTopOffset;
    }
    dragY(event, elem) {
        event.preventDefault();
        if ((event.pageY - elem._mouseCursorTopOffset) >= elem._railMin + 1 && (event.pageY + elem._mouseCursorBottomOffset) <= elem._railMax - 1) {
            let v = event.pageY - elem._rail.offsetTop - elem._mouseCursorTopOffset;
            v = v < 0 ? 0 : v;
            elem._cursor.style.top = v + "px";
            let value = ((v) / ((this._railMax - this._railMin) - this._cursorHeight)) * (this.maxValue - this.minValue) + this.minValue;
            value = (this.maxValue - this.minValue) - value;
            this.ySliderValueChanged.emit({ sliderValue: value });
        }
    }
    stopDrag(elem) {
        elem._rail.onmouseup = null;
        elem._rail.onmousemove = null;
        elem._cursor.onmouseup = null;
        elem._rail.onmouseout = null;
    }
    yWheel(event) {
        event.preventDefault();
        let railDims = this._rail.getBoundingClientRect();
        let coef = (event.pageY - this._rail.offsetTop) / railDims.height;
        this.yZoom.emit({ zoomValue: { coef: coef, zoomType: event.deltaY * -1 } });
    }
    render() {
        return (h("div", { id: "rail", onWheel: (event) => this.yWheel(event) },
            h("div", { id: "cursor", onMouseDown: (event) => this.mouseDown(event) })));
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
    static get style() { return "[data-quantum-vertical-zoom-slider-host]   #rail[data-quantum-vertical-zoom-slider] {\n  position: relative;\n  background-color: var(--quantum-bg-rail-color, grey);\n  opacity: 0.7;\n  width: 20px;\n  margin: 0 0 20px 0;\n  border: 1px solid var(--quantum-border-rail-color, black);\n  border-radius: var(--quantum-border-radius, 6px);\n  padding: 0 0 0 0; }\n\n[data-quantum-vertical-zoom-slider-host]   #rail[data-quantum-vertical-zoom-slider]:hover {\n  opacity: 1; }\n\n[data-quantum-vertical-zoom-slider-host]   #cursor[data-quantum-vertical-zoom-slider] {\n  background-color: var(--quantum-bg-cursor-color, red);\n  position: relative;\n  cursor: move;\n  width: 20px;\n  height: 100%;\n  border: 1px solid var(--quantum-border-cursor-color, black);\n  border-radius: var(--quantum-border-radius, 6px);\n  -webkit-transition: top .01s;\n  transition: top .01s; }"; }
}

export { QuantumChartZoom, QuantumHorizontalZoomSlider, QuantumVerticalZoomSlider };
